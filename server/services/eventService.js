import Event from '../models/Event.js';
import Student from '../models/Student.js';
import coinService from './CoinService.js';

export const processEventAttendance = async (eventId, adminId = null) => {
  try {
    const event = await Event.findById(eventId).populate('registrations.student_id');
    if (!event) throw new Error('Event not found');

    const results = [];

    for (const registration of event.registrations) {
      if (registration.coin_given) continue; // Already processed

      const student = registration.student_id;
      
      if (registration.attended) {
        // Give reward
        await coinService.addCoins(
          student._id,
          event.coin_reward,
          `Event attendance: ${event.title}`,
          'EVENT_ATTENDANCE',
          adminId,
          null,
          event._id
        );
        registration.coin_given = true;
        results.push({
          studentId: student._id,
          studentName: student.full_name,
          action: 'reward',
          amount: event.coin_reward
        });
      } else {
        // Apply penalty
        await coinService.addCoins(
          student._id,
          event.coin_penalty,
          `Event no-show: ${event.title}`,
          'EVENT_NO_SHOW',
          adminId,
          null,
          event._id
        );
        registration.coin_given = true;
        results.push({
          studentId: student._id,
          studentName: student.full_name,
          action: 'penalty',
          amount: event.coin_penalty
        });
      }
    }

    await event.save();
    return { success: true, processed: results.length, results };
  } catch (error) {
    console.error('Error processing event attendance:', error);
    throw error;
  }
};
