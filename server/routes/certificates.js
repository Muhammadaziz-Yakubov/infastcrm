import express from 'express';
import multer from 'multer';
import path from 'path';
import Certificate from '../models/Certificate.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin, authenticateStudent } from '../middleware/auth.js';
import { sendTelegramMessageToChat, sendTelegramPhotoToChat } from '../services/telegramBot.js';
import { checkBadgeEligibility } from '../services/badgeService.js';

const router = express.Router();

// Configure multer for certificate image uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for certificate images
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Helper function to convert buffer to base64 data URL
const bufferToDataUrl = (buffer, mimeType) => {
  if (!buffer) return null;
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

// Get certificates for authenticated student
router.get('/student', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const certificates = await Certificate.find({
      student_id: student._id,
      status: 'ACTIVE'
    })
      .populate('group_id', 'name')
      .populate('issued_by', 'full_name email')
      .sort({ issued_at: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certificates for specific student (student access)
router.get('/view/:studentId', authenticateStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    const certificates = await Certificate.find({
      student_id: studentId,
      status: 'ACTIVE'
    })
      .populate('group_id', 'name')
      .populate('issued_by', 'full_name email')
      .sort({ issued_at: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all certificates (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_id, group_id, status } = req.query;
    const filter = {};

    if (student_id) filter.student_id = student_id;
    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;

    const certificates = await Certificate.find(filter)
      .populate('student_id', 'full_name phone')
      .populate('group_id', 'name')
      .populate('issued_by', 'full_name email')
      .sort({ issued_at: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get students eligible for certificates (admin)
router.get('/eligible-students', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id } = req.query;

    // Get all active students
    const filter = { status: 'ACTIVE' };
    if (group_id) filter.group_id = group_id;

    const students = await Student.find(filter).populate('group_id', 'name telegram_chat_id');

    // Check eligibility for each student
    const eligibleStudents = [];

    for (const student of students) {
      const eligibility = await checkBadgeEligibility(student._id, student.group_id._id);

      if (eligibility.eligible) {
        // Check if student already has a certificate
        const existingCertificate = await Certificate.findOne({
          student_id: student._id,
          status: 'ACTIVE'
        });

        if (!existingCertificate) {
          eligibleStudents.push({
            student: {
              _id: student._id,
              full_name: student.full_name,
              phone: student.phone,
              group_id: student.group_id
            },
            eligibility: eligibility
          });
        }
      }
    }

    res.json(eligibleStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new certificate (admin)
router.post('/', authenticate, requireAdmin, upload.single('certificate_image'), async (req, res) => {
  try {
    const { student_id, group_id, title, description } = req.body;

    if (!student_id || !group_id) {
      return res.status(400).json({ message: 'student_id and group_id are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Certificate image is required' });
    }

    // Verify student and group exist
    const student = await Student.findById(student_id).populate('group_id');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Convert image to base64 data URL
    const isImage = req.file.mimetype && req.file.mimetype.startsWith('image/');
    let certificateImageUrl = '';

    if (isImage && req.file.buffer) {
      certificateImageUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    } else {
      return res.status(400).json({ message: 'Invalid image file' });
    }

    // Create certificate
    const certificate = new Certificate({
      student_id: student_id,
      group_id: group_id,
      title: title || 'Faol O\'quvchi sertifikati',
      description: description || '',
      certificate_image_url: certificateImageUrl,
      issued_by: req.user.userId
    });

    await certificate.save();

    // Populate certificate with related data
    await certificate.populate('student_id', 'full_name phone');
    await certificate.populate('group_id', 'name telegram_chat_id');
    await certificate.populate('issued_by', 'full_name email');

    // Send Telegram notification with certificate image
    try {
      const group = await Group.findById(group_id);
      if (group && group.telegram_chat_id) {
        const caption = `🎉 <b>${student.full_name}</b> Faol O'quvchi sertifikati oldi! Tabriklaymiz!`;

        // Send photo with caption
        const photoSent = await sendTelegramPhotoToChat(
          group.telegram_chat_id,
          certificateImageUrl,
          caption
        );

        if (photoSent) {
          // Update certificate with telegram sent status
          certificate.telegram_sent = true;
          certificate.telegram_sent_at = new Date();
          await certificate.save();
        }
      }
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
      // Don't fail the request if Telegram fails
    }

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certificate by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student_id', 'full_name phone')
      .populate('group_id', 'name')
      .populate('issued_by', 'full_name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update certificate
router.put('/:id', authenticate, requireAdmin, upload.single('certificate_image'), async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;

    if (req.file) {
      const isImage = req.file.mimetype && req.file.mimetype.startsWith('image/');
      if (isImage && req.file.buffer) {
        updateData.certificate_image_url = bufferToDataUrl(req.file.buffer, req.file.mimetype);
      }
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('student_id', 'full_name phone')
      .populate('group_id', 'name')
      .populate('issued_by', 'full_name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete certificate (revoke)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'REVOKED' },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ message: 'Certificate revoked successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
