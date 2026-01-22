import Event from '../models/Event.js';
import Student from '../models/Student.js';

export const processEventAttendance = async (eventId) => {
  try {
    const event = await Event.findById(eventId).populate('registrations.student_id');
    if (!event) throw new Error('Event not found');

    for (const registration of event.registrations) {
      if (registration.coin_given) continue; // Already processed

      const student = registration.student_id;
      if (!student.gamification) {
        student.gamification = { xp: 0, level: 1, badges: [] };
      }

      if (registration.attended) {
        // Give reward
        student.gamification.xp += event.coin_reward;
        registration.coin_given = true;
      } else {
        // Apply penalty
        student.gamification.xp += event.coin_penalty;
        registration.coin_given = true;
      }

      await student.save();
    }

    await event.save();
    return { success: true, processed: event.registrations.length };
  } catch (error) {
    console.error('Error processing event attendance:', error);
    throw error;
  }
};
