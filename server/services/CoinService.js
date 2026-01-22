import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';
import mongoose from 'mongoose';

class CoinService {
  async addCoins(studentId, amount, reason, reasonType, adminId = null, groupId = null, relatedId = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const student = await Student.findById(studentId).session(session);
      if (!student) {
        throw new Error('Student not found');
      }

      student.coin_balance += amount;
      await student.save({ session });

      const history = new CoinHistory({
        student_id: studentId,
        amount,
        type: adminId ? 'ADMIN_ADD' : 'EARN',
        reason,
        reason_type: reasonType,
        balance_after: student.coin_balance,
        group_id: groupId,
        related_id: relatedId,
        admin_id: adminId
      });

      await history.save({ session });
      await session.commitTransaction();

      return { student, history };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deductCoins(studentId, amount, reason, reasonType, adminId = null, groupId = null, relatedId = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const student = await Student.findById(studentId).session(session);
      if (!student) {
        throw new Error('Student not found');
      }

      if (student.coin_balance < amount) {
        student.coin_balance = 0;
      } else {
        student.coin_balance -= amount;
      }

      await student.save({ session });

      const history = new CoinHistory({
        student_id: studentId,
        amount: -amount,
        type: adminId ? 'ADMIN_DEDUCT' : 'SPEND',
        reason,
        reason_type: reasonType,
        balance_after: student.coin_balance,
        group_id: groupId,
        related_id: relatedId,
        admin_id: adminId
      });

      await history.save({ session });
      await session.commitTransaction();

      return { student, history };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteHistoryEntry(historyId, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const history = await CoinHistory.findById(historyId).session(session);
      if (!history) {
        throw new Error('History entry not found');
      }

      if (history.is_deleted) {
        throw new Error('History entry already deleted');
      }

      const student = await Student.findById(history.student_id).session(session);
      if (!student) {
        throw new Error('Student not found');
      }

      student.coin_balance -= history.amount;
      if (student.coin_balance < 0) {
        student.coin_balance = 0;
      }
      await student.save({ session });

      history.is_deleted = true;
      await history.save({ session });

      await session.commitTransaction();

      return { student, history };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getStudentHistory(studentId, limit = 50) {
    return await CoinHistory.find({ 
      student_id: studentId,
      is_deleted: false 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('admin_id', 'full_name')
      .populate('group_id', 'name');
  }

  async getGroupHistory(groupId, limit = 100) {
    return await CoinHistory.find({ 
      group_id: groupId,
      is_deleted: false 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('student_id', 'full_name')
      .populate('admin_id', 'full_name');
  }

  async getAllHistory(limit = 100, skip = 0) {
    return await CoinHistory.find({ is_deleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('student_id', 'full_name')
      .populate('admin_id', 'full_name')
      .populate('group_id', 'name');
  }

  async getStudentBalance(studentId) {
    const student = await Student.findById(studentId).select('coin_balance full_name');
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async bulkAddCoins(studentIds, amount, reason, reasonType, adminId, groupId = null) {
    const results = [];
    for (const studentId of studentIds) {
      try {
        const result = await this.addCoins(studentId, amount, reason, reasonType, adminId, groupId);
        results.push({ studentId, success: true, balance: result.student.coin_balance });
      } catch (error) {
        results.push({ studentId, success: false, error: error.message });
      }
    }
    return results;
  }

  async bulkDeductCoins(studentIds, amount, reason, reasonType, adminId, groupId = null) {
    const results = [];
    for (const studentId of studentIds) {
      try {
        const result = await this.deductCoins(studentId, amount, reason, reasonType, adminId, groupId);
        results.push({ studentId, success: true, balance: result.student.coin_balance });
      } catch (error) {
        results.push({ studentId, success: false, error: error.message });
      }
    }
    return results;
  }
}

export default new CoinService();
