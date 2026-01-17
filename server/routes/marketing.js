import express from 'express';
import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get marketing statistics
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ lead_status: 'CONVERTED' });
    const lostLeads = await Lead.countDocuments({ lead_status: 'LOST' });
    
    // Source statistics
    const sourceStats = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ['$lead_status', 'CONVERTED'] }, 1, 0] }
          }
        }
      }
    ]);

    // Monthly leads
    const monthlyLeads = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Conversion rate
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0;

    res.json({
      totalLeads,
      convertedLeads,
      lostLeads,
      conversionRate,
      sourceStats,
      monthlyLeads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leads
router.get('/leads', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, source, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.lead_status = status;
    if (source) filter.source = source;

    const leads = await Lead.find(filter)
      .populate('group_id', 'name')
      .populate('assigned_to', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(filter);

    res.json({
      leads,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new lead
router.post('/leads', authenticate, requireAdmin, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    await lead.populate('group_id', 'name');
    await lead.populate('assigned_to', 'name email');
    
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update lead
router.put('/leads/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('group_id', 'name')
      .populate('assigned_to', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Convert lead to student
router.post('/leads/:id/convert', authenticate, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if already converted
    if (lead.lead_status === 'CONVERTED') {
      return res.status(400).json({ message: 'Lead already converted' });
    }

    // Create student from lead
    const student = new Student({
      full_name: lead.name,
      phone: lead.phone,
      group_id: lead.group_id,
      status: 'ACTIVE',
      lead_source: lead.source,
      original_lead_id: lead._id,
      conversion_date: new Date()
    });

    await student.save();

    // Update lead status
    lead.lead_status = 'CONVERTED';
    lead.converted_to_student = new Date();
    await lead.save();

    await student.populate('group_id', 'name');

    res.json({
      message: 'Lead converted to student successfully',
      student
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete lead
router.delete('/leads/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get source analytics
router.get('/sources', authenticate, requireAdmin, async (req, res) => {
  try {
    const sources = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: { $cond: [{ $eq: ['$lead_status', 'CONVERTED'] }, 1, 0] }
          },
          lostLeads: {
            $sum: { $cond: [{ $eq: ['$lead_status', 'LOST'] }, 1, 0] }
          },
          avgConversionTime: {
            $avg: {
              $cond: [
                { $eq: ['$lead_status', 'CONVERTED'] },
                { $subtract: ['$converted_to_student', '$createdAt'] },
                null
              ]
            }
          }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $eq: ['$totalLeads', 0] },
              0,
              { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] }
            ]
          }
        }
      },
      { $sort: { totalLeads: -1 } }
    ]);

    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
