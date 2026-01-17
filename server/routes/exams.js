import express from 'express';
import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendTelegramMessageToChat, updateGroupChatId } from '../services/telegramBot.js';

const router = express.Router();

// Get all exams (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, status } = req.query;
    const filter = {};
    
    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;

    const exams = await Exam.find(filter)
      .populate('group_id', 'name')
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new exam (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  console.log('POST /exams request received');
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  
  try {
    const exam = new Exam({
      ...req.body,
      created_by: req.user._id
    });
    
    console.log('Exam object created:', exam);
    
    await exam.save();
    console.log('Exam saved successfully');
    
    await exam.populate('group_id', 'name');
    await exam.populate('created_by', 'name email');
    
    console.log('Exam populated:', exam);
    
    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    console.error('Request body:', req.body);
    console.error('User:', req.user);
    res.status(400).json({ message: error.message });
  }
});

// Get exam by ID (admin)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('group_id', 'name')
      .populate('created_by', 'name email');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update exam (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('group_id', 'name')
      .populate('created_by', 'name email');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exam (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Also delete all results for this exam
    await ExamResult.deleteMany({ exam_id: req.params.id });

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add question to exam (admin)
router.post('/:id/questions', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam.questions.push(req.body);
    await exam.save();

    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update question in exam (admin)
router.put('/:id/questions/:questionIndex', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questionIndex = parseInt(req.params.questionIndex);
    if (questionIndex < 0 || questionIndex >= exam.questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    exam.questions[questionIndex] = req.body;
    await exam.save();

    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question from exam (admin)
router.delete('/:id/questions/:questionIndex', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questionIndex = parseInt(req.params.questionIndex);
    if (questionIndex < 0 || questionIndex >= exam.questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    exam.questions.splice(questionIndex, 1);
    await exam.save();

    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get exam results (admin)
router.get('/:id/results', authenticate, requireAdmin, async (req, res) => {
  try {
    const results = await ExamResult.find({ exam_id: req.params.id })
      .populate('student_id', 'full_name phone')
      .sort({ score: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam statistics (admin)
router.get('/:id/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('group_id');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const results = await ExamResult.find({ exam_id: req.params.id });
    const totalStudents = await Student.countDocuments({ group_id: exam.group_id._id });
    const completedStudents = results.filter(r => r.status === 'FINISHED').length;
    const averageScore = results.length > 0 
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length 
      : 0;
    const averagePercentage = results.length > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length 
      : 0;

    const stats = {
      totalStudents,
      completedStudents,
      completionRate: totalStudents > 0 ? (completedStudents / totalStudents * 100).toFixed(1) : 0,
      averageScore: averageScore.toFixed(1),
      averagePercentage: averagePercentage.toFixed(1),
      highestScore: Math.max(...results.map(r => r.score), 0),
      lowestScore: Math.min(...results.map(r => r.score), 0),
      totalResults: results.length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send exam results to group's Telegram chat (admin)
router.post('/:id/send-results', authenticate, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('group_id', 'name telegram_chat_id');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const groupId = exam.group_id?._id || exam.group_id;
    const group = exam.group_id ? exam.group_id : await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.telegram_chat_id) {
      return res.status(404).json({ message: 'Group has no telegram_chat_id. Please set it in Groups settings.' });
    }

    const results = await ExamResult.find({ exam_id: exam._id })
      .populate('student_id', 'full_name phone')
      .sort({ percentage: -1, score: -1 });

    const header = `
📝 <b>IMTIHON JAVOBLARI</b>

🏷️ <b>Imtihon:</b> ${exam.title}
👥 <b>Guruh:</b> ${group.name || 'Noma\'lum'}
📅 <b>Sana:</b> ${new Date().toLocaleDateString('uz-UZ')}
    `.trim();

    const body = results.length === 0
      ? `

⚠️ Hozircha natijalar yo'q.
      `.trim()
      : `

${results.map((r, i) => {
  const studentName = r.student_id?.full_name || 'Noma\'lum';
  const percent = Number(r.percentage) || 0;
  const score = Number(r.score) || 0;
  const total = Number(r.total_points) || Number(exam.total_points) || 0;
  return `${i + 1}. <b>${studentName}</b>\n🎯 <b>Ball:</b> ${score}/${total}  |  <b>Foiz:</b> ${percent.toFixed(1)}%`;
}).join('\n\n')}
      `.trim();

    const message = `${header}${body}`;

    let currentChatId = group.telegram_chat_id;
    let sent = await sendTelegramMessageToChat(currentChatId, message);

    if (!sent) {
      const newChatId = await updateGroupChatId(groupId, currentChatId);
      if (newChatId && newChatId.toString() !== currentChatId.toString()) {
        currentChatId = newChatId.toString();
        sent = await sendTelegramMessageToChat(currentChatId, message);
      }
    }

    if (!sent) {
      return res.status(500).json({
        message: `Failed to send Telegram message. Check group's telegram_chat_id (it may be upgraded to supergroup). Current chat_id: ${group.telegram_chat_id}`
      });
    }

    res.json({ message: 'Exam results sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
