import Student from '../models/Student.js';
import TaskSubmission from '../models/TaskSubmission.js';
import QuizResult from '../models/QuizResult.js';
import ExamResult from '../models/ExamResult.js';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import Course from '../models/Course.js';

// In-memory cache implementation
const ratingCache = {
    data: new Map(),
    set(key, value, ttlSeconds) {
        this.data.set(key, {
            value,
            expiry: Date.now() + (ttlSeconds * 1000)
        });

        // Cleanup old keys to prevent memory leaks (simple logic)
        if (this.data.size > 100) {
            const now = Date.now();
            for (const [k, v] of this.data.entries()) {
                if (now > v.expiry) this.data.delete(k);
            }
        }
    },
    get(key) {
        const item = this.data.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.data.delete(key);
            return null;
        }
        return item.value;
    },
    clear() {
        this.data.clear();
    }
};

class RatingService {
    async getGlobalRatings(filters = {}) {
        try {
            const { groupId, courseId, limit = 1000 } = filters;

            // Generate cache key
            const cacheKey = `ratings_${groupId || 'all'}_${courseId || 'all'}_${limit}`;

            // Check cache
            const cachedData = ratingCache.get(cacheKey);
            if (cachedData) {
                return cachedData;
            }

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

                // Formula: (LessonScore*10) + (TaskScore*20) + (QuizScore*15) + (ExamScore*50)
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

            // 6. Assign Standard Competition Ranks (1-2-2-4 logic)
            let currentRank = 0;
            let lastPoints = -1;
            ratings.forEach((r, idx) => {
                if (r.total_points !== lastPoints) {
                    currentRank = idx + 1;
                    lastPoints = r.total_points;
                }
                r.rank = currentRank;
            });

            const finalResult = ratings.slice(0, limit);

            // Save to cache (TTL: 5 minutes)
            ratingCache.set(cacheKey, finalResult, 300);

            return finalResult;
        } catch (error) {
            console.error('Error in RatingService.getGlobalRatings:', error);
            throw error;
        }
    }

    // Call this method whenever a score changes (e.g., submission graded, quiz finished)
    // to invalidate the cache.
    invalidateCache() {
        ratingCache.clear();
    }

    async getFilters() {
        try {
            const [groups, courses] = await Promise.all([
                Group.find({ status: { $in: ['ACTIVE', 'NABOR'] } }).select('name').lean(),
                Course.find({ is_active: true }).select('name').lean()
            ]);
            return { groups, courses };
        } catch (error) {
            console.error('Error fetching rating filters:', error);
            return { groups: [], courses: [] };
        }
    }

    async getStudentRank(studentId) {
        // We get top 5000 to ensure we find the student's rank globally
        const ratings = await this.getGlobalRatings({ limit: 5000 });
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
