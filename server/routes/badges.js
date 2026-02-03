import express from 'express';
import Badge from '../models/Badge.js';
import Student from '../models/Student.js';
import { authenticate, authenticateStudent } from '../middleware/auth.js';
import { checkBadgeEligibility, getStudentBadges } from '../services/badgeService.js';

const router = express.Router();

// Get all badges for authenticated student
router.get('/student', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const badges = await getStudentBadges(student._id);
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check badge eligibility for student
router.get('/check-eligibility', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const result = await checkBadgeEligibility(student._id, student.group_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get badge eligibility for specific student (admin only)
router.get('/:studentId/check-eligibility', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const result = await checkBadgeEligibility(studentId, student.group_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all badges for specific student (admin)
router.get('/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    const badges = await getStudentBadges(studentId);
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get badges for specific student (student access)
router.get('/view/:studentId', authenticateStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    const badges = await getStudentBadges(studentId);
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
