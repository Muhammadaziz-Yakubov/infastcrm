import express from 'express';
import Event from '../models/Event.js';
import Student from '../models/Student.js';
import { authenticate, authenticateStudent, requireAdmin } from '../middleware/auth.js';
import { processEventAttendance } from '../services/eventService.js';

const router = express.Router();

// Get all events (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const events = await Event.find({ created_by: req.user._id })
      .populate('registrations.student_id', 'full_name phone')
      .sort({ event_date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming events for students
router.get('/upcoming', authenticateStudent, async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({
      event_date: { $gte: now },
      registration_deadline: { $gte: now }
    })
      .select('title description banner event_date registration_deadline max_participants location registrations coin_reward coin_penalty')
      .sort({ event_date: 1 });

    // Add registration count
    const studentId = req.student?.id;
    const eventsWithCount = events.map(event => ({
      ...event.toObject(),
      registered_count: event.registrations?.length || 0,
      is_registered: event.registrations?.some(r =>
        r.student_id.toString() === studentId
      ) || false
    }));

    res.json(eventsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('👤 User creating event:', req.user);
    console.log('📝 Event data:', req.body);

    const event = new Event({
      ...req.body,
      created_by: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update event (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event (student)
router.post('/:id/register', authenticateStudent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (new Date() > event.registration_deadline) {
      return res.status(400).json({ message: 'Registration deadline passed' });
    }

    if (event.registrations.length >= event.max_participants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const studentId = req.student?.id;
    const alreadyRegistered = event.registrations.some(r =>
      r.student_id.toString() === studentId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.registrations.push({ student_id: studentId });
    await event.save();

    res.json({ message: 'Successfully registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance (admin)
router.post('/:id/attendance', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_ids } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Mark all as not attended first
    event.registrations.forEach(reg => {
      reg.attended = false;
    });

    // Mark attended students
    student_ids.forEach(studentId => {
      const reg = event.registrations.find(r =>
        r.student_id.toString() === studentId
      );
      if (reg) {
        reg.attended = true;
      }
    });

    await event.save();
    res.json({ message: 'Attendance updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process event rewards/penalties (admin)
router.post('/:id/process-rewards', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await processEventAttendance(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event details
router.get('/:id', authenticateStudent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registrations.student_id', 'full_name phone');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
