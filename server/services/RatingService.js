import Student from '../models/Student.js';
import TaskSubmission from '../models/TaskSubmission.js';
import QuizResult from '../models/QuizResult.js';
import ExamResult from '../models/ExamResult.js';
import Attendance from '../models/Attendance.js';
import mongoose from 'mongoose';

class RatingService {
    async getGlobalRatings() {
        try {
            // 1. Get all active students
            const students = await Student.find({ status: { $in: ['ACTIVE', 'DEBTOR'] } })
                .select('full_name profile_image group_id')
                .populate('group_id', 'name')
                .lean();

            const studentIds = students.map(s => s._id);

            // 2. Aggregate counts and scores from all sources in parallel
            const [taskScores, quizScores, examScores, attendanceScores] = await Promise.all([
                // Tasks (GRADED)
                TaskSubmission.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'GRADED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                // Quizzes (FINISHED)
                QuizResult.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'FINISHED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                // Exams (FINISHED)
                ExamResult.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'FINISHED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                // Attendance/Lessons
                Attendance.aggregate([
                    { $match: { student_id: { $in: studentIds } } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ])
            ]);

            // 3. Convert aggregate results to maps for O(1) lookup
            const taskMap = new Map(taskScores.map(i => [i._id.toString(), i]));
            const quizMap = new Map(quizScores.map(i => [i._id.toString(), i]));
            const examMap = new Map(examScores.map(i => [i._id.toString(), i]));
            const attendanceMap = new Map(attendanceScores.map(i => [i._id.toString(), i]));

            // 4. Calculate weighted total score for each student
            // Weights: Lessons (10), Tasks (20), Quizzes (15), Exams (50)
            const ratings = students.map(student => {
                const sid = student._id.toString();
                const stats = {
                    lessons: attendanceMap.get(sid) || { total: 0, count: 0 },
                    tasks: taskMap.get(sid) || { total: 0, count: 0 },
                    quizzes: quizMap.get(sid) || { total: 0, count: 0 },
                    exams: examMap.get(sid) || { total: 0, count: 0 }
                };

                const totalPoints =
                    (stats.lessons.total * 10) +
                    (stats.tasks.total * 20) +
                    (stats.quizzes.total * 15) +
                    (stats.exams.total * 50);

                return {
                    student_id: student._id,
                    full_name: student.full_name,
                    profile_image: student.profile_image,
                    group_name: student.group_id?.name || 'Noma\'lum',
                    total_points: totalPoints,
                    stats: {
                        lessons: stats.lessons.count,
                        tasks: stats.tasks.count,
                        quizzes: stats.quizzes.count,
                        exams: stats.exams.count
                    }
                };
            });

            // 5. Sort by total_points DESC
            ratings.sort((a, b) => b.total_points - a.total_points);

            // 6. Assign ranks (handle ties properly if needed, but simple index is fine for now)
            ratings.forEach((r, idx) => {
                r.rank = idx + 1;
            });

            return ratings;
        } catch (error) {
            console.error('Error in RatingService.getGlobalRatings:', error);
            throw error;
        }
    }

    async getStudentRank(studentId) {
        const ratings = await this.getGlobalRatings();
        const studentRating = ratings.find(r => r.student_id.toString() === studentId.toString());

        if (!studentRating) {
            return {
                rank: ratings.length + 1,
                total_points: 0,
                total_students: ratings.length
            };
        }

        return {
            ...studentRating,
            total_students: ratings.length
        };
    }
}

export default new RatingService();
