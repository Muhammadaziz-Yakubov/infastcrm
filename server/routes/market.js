import express from 'express';
import MarketItem from '../models/MarketItem.js';
import MarketOrder from '../models/MarketOrder.js';
import Student from '../models/Student.js';
import CoinService from '../services/CoinService.js';
import { authenticateStudent, authenticate, requireAdmin } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/items', authenticateStudent, async (req, res) => {
  try {
    const items = await MarketItem.find({ is_active: true }).sort({ price: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get market items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/balance', authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('coin_balance full_name');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ 
      balance: student.coin_balance,
      full_name: student.full_name 
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/purchase/:itemId', authenticateStudent, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId } = req.params;
    const studentId = req.student._id;

    const item = await MarketItem.findById(itemId).session(session);
    if (!item || !item.is_active) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Item not found or inactive' });
    }

    if (item.stock === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Item out of stock' });
    }

    const student = await Student.findById(studentId).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.coin_balance < item.price) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    const existingOrder = await MarketOrder.findOne({
      student_id: studentId,
      item_id: itemId,
      status: 'PENDING'
    }).session(session);

    if (existingOrder) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You already have a pending order for this item' });
    }

    student.coin_balance -= item.price;
    await student.save({ session });

    const order = new MarketOrder({
      student_id: studentId,
      item_id: itemId,
      item_name: item.name,
      item_price: item.price,
      status: item.requires_confirmation ? 'PENDING' : 'CONFIRMED'
    });

    if (!item.requires_confirmation) {
      order.confirmed_at = new Date();
    }

    await order.save({ session });

    if (item.stock > 0) {
      item.stock -= 1;
      await item.save({ session });
    }

    await CoinService.addCoins(
      studentId,
      -item.price,
      `Purchased: ${item.name}`,
      'MARKET_PURCHASE',
      null,
      student.group_id,
      order._id
    );

    await session.commitTransaction();

    res.json({ 
      message: item.requires_confirmation 
        ? 'Order placed successfully. Waiting for admin confirmation.' 
        : 'Purchase successful!',
      order,
      balance: student.coin_balance
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
});

router.get('/orders', authenticateStudent, async (req, res) => {
  try {
    const orders = await MarketOrder.find({ student_id: req.student._id })
      .sort({ createdAt: -1 })
      .populate('item_id');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/history', authenticateStudent, async (req, res) => {
  try {
    const history = await CoinService.getStudentHistory(req.student._id, 50);
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/admin/items', authenticate, requireAdmin, async (req, res) => {
  try {
    const items = await MarketItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get admin items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/admin/items', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, image, type, stock, requires_confirmation } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price required' });
    }

    const item = new MarketItem({
      name,
      description,
      price,
      image,
      type,
      stock: stock || -1,
      requires_confirmation: requires_confirmation !== false
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/admin/items/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await MarketItem.findByIdAndUpdate(id, updates, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/admin/items/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MarketItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/admin/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await MarketOrder.find(query)
      .sort({ createdAt: -1 })
      .populate('student_id', 'full_name phone')
      .populate('item_id')
      .populate('confirmed_by', 'full_name');

    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/admin/orders/:id/confirm', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await MarketOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Order is not pending' });
    }

    order.status = 'CONFIRMED';
    order.confirmed_by = req.user.userId;
    order.confirmed_at = new Date();
    await order.save();

    res.json({ message: 'Order confirmed successfully', order });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/admin/orders/:id/cancel', authenticate, requireAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await MarketOrder.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'CANCELLED') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Order already cancelled' });
    }

    const student = await Student.findById(order.student_id).session(session);
    if (student) {
      student.coin_balance += order.item_price;
      await student.save({ session });

      await CoinService.addCoins(
        order.student_id,
        order.item_price,
        `Order cancelled: ${order.item_name}${reason ? ` - ${reason}` : ''}`,
        'ORDER_CANCELLED',
        req.user.userId,
        student.group_id,
        order._id
      );
    }

    const item = await MarketItem.findById(order.item_id).session(session);
    if (item && item.stock >= 0) {
      item.stock += 1;
      await item.save({ session });
    }

    order.status = 'CANCELLED';
    order.cancelled_reason = reason || '';
    await order.save({ session });

    await session.commitTransaction();

    res.json({ message: 'Order cancelled and coins refunded', order });
  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
