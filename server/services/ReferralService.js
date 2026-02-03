import Referral from '../models/Referral.js';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';

class ReferralService {
  static async createReferral(referrerId, friendId, adminId, notes = '') {
    const referrer = await Student.findById(referrerId);
    if (!referrer) {
      throw new Error('Taklif qilgan talaba topilmadi');
    }

    const friend = await Student.findById(friendId);
    if (!friend) {
      throw new Error('Taklif qilingan talaba topilmadi');
    }

    const existingReferral = await Referral.findOne({
      referrer_id: referrerId,
      friend_id: friendId
    });

    if (existingReferral) {
      throw new Error('Bu referral allaqachon mavjud');
    }

    const referral = new Referral({
      referrer_id: referrerId,
      friend_id: friendId,
      admin_id: adminId,
      notes,
      status: 'PENDING'
    });

    await referral.save();

    return referral;
  }

  static async approveReferral(referralId, adminId) {
    const referral = await Referral.findById(referralId);
    if (!referral) {
      throw new Error('Referral topilmadi');
    }

    if (referral.status !== 'PENDING') {
      throw new Error('Faqat PENDING statusdagi referrallarni tasdiqlash mumkin');
    }

    referral.status = 'ACTIVE';
    referral.approved_date = new Date();

    await referral.save();

    return referral;
  }

  static async handleFriendFirstPayment(friendId, paymentAmount) {
    const referral = await Referral.findOne({
      friend_id: friendId,
      status: 'ACTIVE',
      friend_first_payment_date: null
    }).populate('referrer_id');

    if (!referral) {
      return null;
    }

    referral.friend_first_payment_date = new Date();
    referral.friend_first_payment_amount = paymentAmount;
    referral.discount_active = true;
    referral.status = 'COMPLETED';

    await referral.save();

    return {
      referral,
      discountPercent: referral.discount_percent,
      message: `Referrer ${referral.referrer_id.full_name} uchun ${referral.discount_percent}% chegirma aktivlashtirildi`
    };
  }

  static async calculateReferrerDiscount(referrerId, paymentAmount) {
    const activeReferrals = await Referral.find({
      referrer_id: referrerId,
      discount_active: true,
      status: 'COMPLETED'
    });

    if (activeReferrals.length === 0) {
      return { hasDiscount: false, discountAmount: 0, discountPercent: 0 };
    }

    const totalDiscountPercent = activeReferrals.reduce((sum, ref) => sum + ref.discount_percent, 0);
    const maxDiscount = Math.min(totalDiscountPercent, 100);
    const discountAmount = (paymentAmount * maxDiscount) / 100;

    for (const referral of activeReferrals) {
      referral.total_discount_given += discountAmount / activeReferrals.length;
      await referral.save();
    }

    return {
      hasDiscount: true,
      discountAmount,
      discountPercent: maxDiscount,
      activeReferralsCount: activeReferrals.length
    };
  }

  static async getReferralsByReferrer(referrerId) {
    const referrals = await Referral.find({ referrer_id: referrerId })
      .populate('friend_id', 'full_name phone status')
      .populate('admin_id', 'full_name')
      .sort({ createdAt: -1 })
      .lean();

    return referrals;
  }

  static async getReferralsByFriend(friendId) {
    const referral = await Referral.findOne({ friend_id: friendId })
      .populate('referrer_id', 'full_name phone')
      .populate('admin_id', 'full_name')
      .lean();

    return referral;
  }

  static async getAllReferrals(status = null) {
    const query = status ? { status } : {};
    
    const referrals = await Referral.find(query)
      .populate('referrer_id', 'full_name phone status')
      .populate('friend_id', 'full_name phone status')
      .populate('admin_id', 'full_name')
      .sort({ createdAt: -1 })
      .lean();

    return referrals;
  }

  static async cancelReferral(referralId, adminId, reason) {
    const referral = await Referral.findById(referralId);
    if (!referral) {
      throw new Error('Referral topilmadi');
    }

    referral.status = 'CANCELLED';
    referral.notes = `${referral.notes}\nBekor qilindi: ${reason}`;
    await referral.save();

    return referral;
  }

  static async getStatistics() {
    const totalReferrals = await Referral.countDocuments();
    const activeReferrals = await Referral.countDocuments({ status: 'ACTIVE' });
    const completedReferrals = await Referral.countDocuments({ status: 'COMPLETED' });
    const pendingReferrals = await Referral.countDocuments({ status: 'PENDING' });

    const topReferrers = await Referral.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'COMPLETED'] } } },
      {
        $group: {
          _id: '$referrer_id',
          referralCount: { $sum: 1 },
          totalDiscountGiven: { $sum: '$total_discount_given' }
        }
      },
      { $sort: { referralCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          full_name: '$student.full_name',
          phone: '$student.phone',
          referralCount: 1,
          totalDiscountGiven: 1
        }
      }
    ]);

    return {
      totalReferrals,
      activeReferrals,
      completedReferrals,
      pendingReferrals,
      topReferrers
    };
  }
}

export default ReferralService;
