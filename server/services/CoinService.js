import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';
import mongoose from 'mongoose';

class CoinService {
  async addCoins(studentId, amount, reason, reasonType, adminId = null, groupId = null, relatedId = null) {
    const startTime = Date.now();
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.error('❌ Coin add operation timeout after 5 seconds');
    }, 5000);

    try {
      console.log(`🪙 Adding ${amount} coins to student ${studentId}`);
      
      // Use atomic operation with better error handling
      const student = await Student.findByIdAndUpdate(
        studentId,
        { $inc: { coin_balance: amount } },
        { new: true, runValidators: false }
      ).maxTimeMS(3000);
      
      if (!student) {
        clearTimeout(timeout);
        throw new Error(`Student not found: ${studentId}`);
      }

      // Create history record with validation
      const history = new CoinHistory({
        student_id: studentId,
        amount,
        type: adminId ? 'ADMIN_ADD' : 'EARN',
        reason: reason?.trim() || 'No reason provided',
        reason_type: reasonType || 'UNKNOWN',
        balance_after: student.coin_balance,
        group_id: groupId,
        related_id: relatedId,
        admin_id: adminId
      });

      await history.save().maxTimeMS(2000);
      
      clearTimeout(timeout);
      console.log(`✅ Added ${amount} coins to ${studentId} in ${Date.now() - startTime}ms`);
      
      return { student, history };
    } catch (error) {
      clearTimeout(timeout);
      console.error(`❌ Error adding coins to ${studentId}:`, error.message);
      
      // Handle specific database errors
      if (error.name === 'ValidationError') {
        throw new Error(`Invalid data: ${error.message}`);
      }
      if (error.name === 'CastError') {
        throw new Error(`Invalid student ID format: ${studentId}`);
      }
      
      throw error;
    }
  }

  async deductCoins(studentId, amount, reason, reasonType, adminId = null, groupId = null, relatedId = null) {
    const startTime = Date.now();
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.error('❌ Coin deduct operation timeout after 5 seconds');
    }, 5000);

    try {
      console.log(`🪙 Deducting ${amount} coins from student ${studentId}`);
      
      // Use atomic operation to prevent negative balance
      const student = await Student.findOneAndUpdate(
        { 
          _id: studentId,
          coin_balance: { $gte: 0 } // Ensure student exists and has valid balance
        },
        { 
          $inc: { coin_balance: -amount },
          $set: { coin_balance: { $max: [0, { $subtract: ['$coin_balance', amount] }] } }
        },
        { new: true, runValidators: false }
      ).maxTimeMS(3000);
      
      if (!student) {
        clearTimeout(timeout);
        throw new Error(`Student not found: ${studentId}`);
      }

      // Ensure balance doesn't go negative
      if (student.coin_balance < 0) {
        student.coin_balance = 0;
        await student.save().maxTimeMS(2000);
      }

      // Create history record
      const history = new CoinHistory({
        student_id: studentId,
        amount: -amount,
        type: adminId ? 'ADMIN_DEDUCT' : 'SPEND',
        reason: reason?.trim() || 'No reason provided',
        reason_type: reasonType || 'UNKNOWN',
        balance_after: student.coin_balance,
        group_id: groupId,
        related_id: relatedId,
        admin_id: adminId
      });

      await history.save().maxTimeMS(2000);
      
      clearTimeout(timeout);
      console.log(`✅ Deducted ${amount} coins from ${studentId} in ${Date.now() - startTime}ms`);
      
      return { student, history };
    } catch (error) {
      clearTimeout(timeout);
      console.error(`❌ Error deducting coins from ${studentId}:`, error.message);
      
      // Handle specific database errors
      if (error.name === 'ValidationError') {
        throw new Error(`Invalid data: ${error.message}`);
      }
      if (error.name === 'CastError') {
        throw new Error(`Invalid student ID format: ${studentId}`);
      }
      
      throw error;
    }
  }

  async deleteHistoryEntry(historyId, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const history = await CoinHistory.findById(historyId).session(session);
      if (!history) {
        throw new Error('History entry not found');
      }

      if (history.is_deleted) {
        throw new Error('History entry already deleted');
      }

      const student = await Student.findById(history.student_id).session(session);
      if (!student) {
        throw new Error('Student not found');
      }

      student.coin_balance -= history.amount;
      if (student.coin_balance < 0) {
        student.coin_balance = 0;
      }
      await student.save({ session });

      history.is_deleted = true;
      await history.save({ session });

      await session.commitTransaction();

      return { student, history };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getStudentHistory(studentId, limit = 50) {
    try {
      console.log(`📋 Getting history for student ${studentId}, limit: ${limit}`);
      
      const history = await CoinHistory.find({ 
        student_id: studentId,
        is_deleted: false 
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('admin_id', 'full_name')
        .populate('group_id', 'name')
        .maxTimeMS(5000);
        
      console.log(`📊 Found ${history.length} history records for student ${studentId}`);
      return history;
    } catch (error) {
      console.error(`❌ Error getting history for student ${studentId}:`, error.message);
      
      // Fallback without populate
      try {
        console.log(`🔄 Trying fallback without populate for student ${studentId}...`);
        const history = await CoinHistory.find({ 
          student_id: studentId,
          is_deleted: false 
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .maxTimeMS(3000);
          
        console.log(`📊 Fallback found ${history.length} history records`);
        return history;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
        throw new Error('Failed to fetch student history');
      }
    }
  }

  async getGroupHistory(groupId, limit = 100) {
    try {
      console.log(`📋 Getting history for group ${groupId}, limit: ${limit}`);
      
      const history = await CoinHistory.find({ 
        group_id: groupId,
        is_deleted: false 
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('student_id', 'full_name')
        .populate('admin_id', 'full_name')
        .maxTimeMS(5000);
        
      console.log(`📊 Found ${history.length} history records for group ${groupId}`);
      return history;
    } catch (error) {
      console.error(`❌ Error getting history for group ${groupId}:`, error.message);
      
      // Fallback without populate
      try {
        console.log(`🔄 Trying fallback without populate for group ${groupId}...`);
        const history = await CoinHistory.find({ 
          group_id: groupId,
          is_deleted: false 
        })
          .sort({ createdAt: -1 })
          .limit(limit)
          .maxTimeMS(3000);
          
        console.log(`📊 Fallback found ${history.length} history records`);
        return history;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
        throw new Error('Failed to fetch group history');
      }
    }
  }

  async getAllHistory(limit = 100, skip = 0) {
    try {
      console.log(`📋 Getting all history, limit: ${limit}, skip: ${skip}`);
      
      const history = await CoinHistory.find({ is_deleted: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('student_id', 'full_name')
        .populate('admin_id', 'full_name')
        .populate('group_id', 'name')
        .maxTimeMS(8000);
        
      console.log(`📊 Found ${history.length} history records`);
      return history;
    } catch (error) {
      console.error('❌ Error getting all history:', error.message);
      
      // Fallback without populate
      try {
        console.log('🔄 Trying fallback without populate for all history...');
        const history = await CoinHistory.find({ is_deleted: false })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .maxTimeMS(5000);
          
        console.log(`📊 Fallback found ${history.length} history records`);
        return history;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
        throw new Error('Failed to fetch all history');
      }
    }
  }

  async getStudentBalance(studentId) {
    try {
      console.log(`💰 Getting balance for student ${studentId}`);
      
      const student = await Student.findById(studentId)
        .select('coin_balance full_name')
        .maxTimeMS(3000);
        
      if (!student) {
        throw new Error(`Student not found: ${studentId}`);
      }
      
      console.log(`💰 Student ${studentId} balance: ${student.coin_balance}`);
      return student;
    } catch (error) {
      console.error(`❌ Error getting balance for student ${studentId}:`, error.message);
      
      if (error.name === 'CastError') {
        throw new Error(`Invalid student ID format: ${studentId}`);
      }
      
      throw error;
    }
  }

  async bulkAddCoins(studentIds, amount, reason, reasonType, adminId, groupId = null) {
    const startTime = Date.now();
    console.log(`🪙 Bulk adding ${amount} coins to ${studentIds.length} students`);
    
    // Set timeout for bulk operation
    const timeout = setTimeout(() => {
      console.error('❌ Bulk coin add operation timeout after 15 seconds');
    }, 15000);

    try {
      // Use bulkWrite for much better performance
      const bulkOps = studentIds.map(studentId => ({
        updateOne: {
          filter: { _id: studentId },
          update: { $inc: { coin_balance: amount } },
          upsert: false
        }
      }));

      // Execute bulk operation
      const bulkResult = await Student.bulkWrite(bulkOps, { 
        ordered: false, // Continue on errors
        maxTimeMS: 10000 
      });

      // Get updated students for history records
      const updatedStudents = await Student.find({ 
        _id: { $in: studentIds } 
      }).select('_id coin_balance').maxTimeMS(5000);

      // Create history records in bulk
      const historyRecords = updatedStudents.map(student => ({
        student_id: student._id,
        amount,
        type: adminId ? 'ADMIN_ADD' : 'EARN',
        reason: reason?.trim() || 'Bulk coin addition',
        reason_type: reasonType || 'BULK_ADD',
        balance_after: student.coin_balance,
        group_id: groupId,
        admin_id: adminId
      }));

      // Insert history records in bulk
      let savedHistories = [];
      if (historyRecords.length > 0) {
        try {
          savedHistories = await CoinHistory.insertMany(historyRecords, { 
            ordered: false,
            maxTimeMS: 5000 
          });
        } catch (historyError) {
          console.error('❌ Error saving bulk history:', historyError.message);
          // Continue even if history fails
        }
      }

      clearTimeout(timeout);
      console.log(`✅ Bulk added coins in ${Date.now() - startTime}ms - Modified: ${bulkResult.modifiedCount}, Matched: ${bulkResult.matchedCount}`);

      return {
        success: true,
        totalStudents: studentIds.length,
        modifiedCount: bulkResult.modifiedCount,
        matchedCount: bulkResult.matchedCount,
        upsertedCount: bulkResult.upsertedCount,
        histories: savedHistories
      };
      
    } catch (error) {
      clearTimeout(timeout);
      console.error('❌ Bulk coin add error:', error.message);
      
      // Fallback to individual operations if bulk fails
      console.log('🔄 Falling back to individual operations...');
      const results = [];
      
      for (const studentId of studentIds) {
        try {
          const result = await this.addCoins(studentId, amount, reason, reasonType, adminId, groupId);
          results.push({ studentId, success: true, balance: result.student.coin_balance });
        } catch (error) {
          results.push({ studentId, success: false, error: error.message });
        }
      }
      
      return results;
    }
  }

  async bulkDeductCoins(studentIds, amount, reason, reasonType, adminId, groupId = null) {
    const startTime = Date.now();
    console.log(`🪙 Bulk deducting ${amount} coins from ${studentIds.length} students`);
    
    // Set timeout for bulk operation
    const timeout = setTimeout(() => {
      console.error('❌ Bulk coin deduct operation timeout after 15 seconds');
    }, 15000);

    try {
      // Use bulkWrite for much better performance
      const bulkOps = studentIds.map(studentId => ({
        updateOne: {
          filter: { _id: studentId, coin_balance: { $gte: 0 } },
          update: [{ 
            $set: { coin_balance: { $max: [0, { $subtract: ['$coin_balance', amount] }] } }
          }],
          upsert: false
        }
      }));

      // Execute bulk operation
      const bulkResult = await Student.bulkWrite(bulkOps, { 
        ordered: false, // Continue on errors
        maxTimeMS: 10000 
      });

      // Get updated students for history records
      const updatedStudents = await Student.find({ 
        _id: { $in: studentIds } 
      }).select('_id coin_balance').maxTimeMS(5000);

      // Create history records in bulk
      const historyRecords = updatedStudents.map(student => ({
        student_id: student._id,
        amount: -amount,
        type: adminId ? 'ADMIN_DEDUCT' : 'SPEND',
        reason: reason?.trim() || 'Bulk coin deduction',
        reason_type: reasonType || 'BULK_DEDUCT',
        balance_after: student.coin_balance,
        group_id: groupId,
        admin_id: adminId
      }));

      // Insert history records in bulk
      let savedHistories = [];
      if (historyRecords.length > 0) {
        try {
          savedHistories = await CoinHistory.insertMany(historyRecords, { 
            ordered: false,
            maxTimeMS: 5000 
          });
        } catch (historyError) {
          console.error('❌ Error saving bulk history:', historyError.message);
          // Continue even if history fails
        }
      }

      clearTimeout(timeout);
      console.log(`✅ Bulk deducted coins in ${Date.now() - startTime}ms - Modified: ${bulkResult.modifiedCount}, Matched: ${bulkResult.matchedCount}`);

      return {
        success: true,
        totalStudents: studentIds.length,
        modifiedCount: bulkResult.modifiedCount,
        matchedCount: bulkResult.matchedCount,
        upsertedCount: bulkResult.upsertedCount,
        histories: savedHistories
      };
      
    } catch (error) {
      clearTimeout(timeout);
      console.error('❌ Bulk coin deduct error:', error.message);
      
      // Fallback to individual operations if bulk fails
      console.log('🔄 Falling back to individual operations...');
      const results = [];
      
      for (const studentId of studentIds) {
        try {
          const result = await this.deductCoins(studentId, amount, reason, reasonType, adminId, groupId);
          results.push({ studentId, success: true, balance: result.student.coin_balance });
        } catch (error) {
          results.push({ studentId, success: false, error: error.message });
        }
      }
      
      return results;
    }
  }
}

export default new CoinService();
