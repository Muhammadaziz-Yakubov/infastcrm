import Attendance from '../models/Attendance.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Badge from '../models/Badge.js';

/**
 * Check if student is eligible for "Faol O'quvchi" badge based on:
 * - Last 5 lessons: Full attendance (PRESENT)
 * - Last 5 lessons: 100 score each
 * - Last 5 homework tasks: 70+ score each
 */
export const checkBadgeEligibility = async (studentId, groupId) => {
  try {
    // Get last 5 attendance records (lessons) - ordered by date descending
    const last5Attendances = await Attendance.find({
      student_id: studentId,
      group_id: groupId,
      status: 'PRESENT'
    })
      .sort({ date: -1 })
      .limit(5);

    // Check if we have at least 5 attendances
    if (last5Attendances.length < 5) {
      return {
        eligible: false,
        reason: `Oxirgi 5 darsga to'liq qatnashish kerak. Hozirda: ${last5Attendances.length}/5`
      };
    }

    // Check if all 5 attendances have score of 100
    const allPerfectScores = last5Attendances.every(att => att.score === 100);
    if (!allPerfectScores) {
      const scores = last5Attendances.map(att => att.score || 0).join(', ');
      return {
        eligible: false,
        reason: `Oxirgi 5 darsda har birida 100 ball olish kerak. Hozirgi ballar: ${scores}`
      };
    }

    // Get last 5 homework task submissions with scores
    const last5Submissions = await TaskSubmission.find({
      student_id: studentId,
      status: 'GRADED',
      score: { $gte: 70 } // At least 70 score
    })
      .sort({ graded_at: -1 })
      .limit(5);

    // Check if we have at least 5 homework submissions with 70+ score
    if (last5Submissions.length < 5) {
      return {
        eligible: false,
        reason: `Oxirgi 5 uyga vazifada 70+ ball olish kerak. Hozirda: ${last5Submissions.length}/5`
      };
    }

    // All conditions met!
    return {
      eligible: true,
      details: {
        attendances: last5Attendances.length,
        perfectScores: true,
        homeworkCount: last5Submissions.length,
        homeworkScores: last5Submissions.map(sub => sub.score)
      }
    };
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
    return {
      eligible: false,
      reason: 'Xatolik yuz berdi: ' + error.message
    };
  }
};

/**
 * Award badge to student if not already awarded
 */
export const awardBadge = async (studentId, type, title, description, condition) => {
  try {
    // Check if badge already exists
    const existingBadge = await Badge.findOne({
      student_id: studentId,
      type: type,
      is_active: true
    });

    if (existingBadge) {
      return {
        success: false,
        message: 'Badge allaqachon berilgan',
        badge: existingBadge
      };
    }

    // Create new badge
    const badge = new Badge({
      student_id: studentId,
      type: type,
      title: title,
      description: description,
      condition: condition,
      is_active: true
    });

    await badge.save();
    await badge.populate('student_id', 'full_name phone');

    return {
      success: true,
      message: 'Badge muvaffaqiyatli berildi',
      badge: badge
    };
  } catch (error) {
    console.error('Error awarding badge:', error);
    return {
      success: false,
      message: 'Badge berishda xatolik: ' + error.message
    };
  }
};

/**
 * Get all badges for a student
 */
export const getStudentBadges = async (studentId) => {
  try {
    const badges = await Badge.find({
      student_id: studentId,
      is_active: true
    }).sort({ earned_at: -1 });

    return badges;
  } catch (error) {
    console.error('Error getting student badges:', error);
    return [];
  }
};

export default {
  checkBadgeEligibility,
  awardBadge,
  getStudentBadges
};
