import Student from '../models/Student.js';
import TaskSubmission from '../models/TaskSubmission.js';
import QuizResult from '../models/QuizResult.js';
import ExamResult from '../models/ExamResult.js';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import Course from '../models/Course.js';

class RatingService {
    async getGlobalRatings(filters = {}) {
        try {
            const { groupId, courseId, limit = 100 } = filters;

            // 1. Build student filter
            const studentFilter = { status: { $in: ['ACTIVE', 'DEBTOR'] } };

            if (groupId) {
                studentFilter.group_id = groupId;
            }

            // If filtering by Course, we need to find groups of that course first
            if (courseId && !groupId) {
                const groupsInCourse = await Group.find({ course_id: courseId }).select('_id');
                const groupIds = groupsInCourse.map(g => g._id);
                studentFilter.group_id = { $in: groupIds };
            }

            // 2. Get students
            const students = await Student.find(studentFilter)
                .select('full_name profile_image group_id')
                .populate({
                    path: 'group_id',
                    select: 'name course_id',
                    populate: { path: 'course_id', select: 'name' }
                })
                .lean();

            if (students.length === 0) return [];

            const studentIds = students.map(s => s._id);

            // 3. Aggregate scores from all sources
            const [taskScores, quizScores, examScores, attendanceScores] = await Promise.all([
                TaskSubmission.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'GRADED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                QuizResult.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'FINISHED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                ExamResult.aggregate([
                    { $match: { student_id: { $in: studentIds }, status: 'FINISHED' } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ]),
                Attendance.aggregate([
                    { $match: { student_id: { $in: studentIds } } },
                    { $group: { _id: '$student_id', total: { $sum: { $ifNull: ['$score', 0] } }, count: { $sum: 1 } } }
                ])
            ]);

            const taskMap = new Map(taskScores.map(i => [i._id.toString(), i]));
            const quizMap = new Map(quizScores.map(i => [i._id.toString(), i]));
            const examMap = new Map(examScores.map(i => [i._id.toString(), i]));
            const attendanceMap = new Map(attendanceScores.map(i => [i._id.toString(), i]));

            // 4. Calculate weighted total score
            const ratings = students.map(student => {
                const sid = student._id.toString();
                const stats = {
                    lessons: attendanceMap.get(sid) || { total: 0, count: 0 },
                    tasks: taskMap.get(sid) || { total: 0, count: 0 },
                    quizzes: quizMap.get(sid) || { total: 0, count: 0 },
                    exams: examMap.get(sid) || { total: 0, count: 0 }
                };

                // Calculation: (LessonScore*10) + (TaskScore*20) + (QuizScore*15) + (ExamScore*50)
                // Max theoretical: (100*10) + (100*20) + (100*15) + (100*50) = 1000 + 2000 + 1500 + 5000 = 9500 per unit
                // With multiple tasks/exams, it can reach ~100k
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
                    course_name: student.group_id?.course_id?.name || 'InFast IT',
                    total_points: totalPoints,
                    stats: {
                        lessons: stats.lessons.count,
                        tasks: stats.tasks.count,
                        quizzes: stats.quizzes.count,
                        exams: stats.exams.count
                    }
                };
            });

            // 5. Sort by total_points DESC, then by name ASC
            ratings.sort((a, b) => {
                if (b.total_points !== a.total_points) {
                    return b.total_points - a.total_points;
                }
                return a.full_name.localeCompare(b.full_name);
            });

            // 6. Assign unique ranks
            ratings.forEach((r, idx) => {
                r.rank = idx + 1;
            });

            return ratings.slice(0, limit);
        } catch (error) {
            console.error('Error in RatingService.getGlobalRatings:', error);
            throw error;
        }
    }

    async getFilters() {
        try {
            const [groups, courses] = await Promise.all([
                Group.find({ status: 'ACTIVE' }).select('name').lean(),
                Course.find({ is_active: true }).select('name').lean()
            ]);
            return { groups, courses };
        } catch (error) {
            console.error('Error fetching rating filters:', error);
            return { groups: [], courses: [] };
        }
    }

    async getStudentRank(studentId) {
        const ratings = await this.getGlobalRatings({ limit: 10000 });
        const studentRating = ratings.find(r => r.student_id.toString() === studentId.toString());

        if (!studentRating) {
            return {
                rank: ratings.length + 1,
                total_points: 0,
                total_students: ratings.length,
                stats: { lessons: 0, tasks: 0, quizzes: 0, exams: 0 }
            };
        }

        return {
            ...studentRating,
            total_students: ratings.length
        };
    }
}

export default new RatingService();
