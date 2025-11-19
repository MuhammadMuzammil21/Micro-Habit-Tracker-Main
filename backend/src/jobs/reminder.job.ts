import * as cron from 'node-cron';
import Habit from '../models/Habit';
import User from '../models/User';
import HabitEntry from '../models/HabitEntry';
import { sendHabitReminder } from '../services/email.service';

// Run every hour to check for reminders
export const startReminderJob = () => {
  // Run at the start of every hour (e.g., 8:00, 9:00, 10:00)
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      console.log(`[Reminder Job] Running at ${currentTime}`);

      // Find all active habits with reminder times matching current time
      const habits = await Habit.find({
        isActive: true,
        reminderTime: currentTime,
      }).populate('userId', 'email name');

      for (const habit of habits) {
        const user = habit.userId as any;
        if (!user || !user.email) continue;

        // Check if habit was already completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const completedToday = await HabitEntry.findOne({
          habitId: habit._id,
          userId: habit.userId,
          completedAt: {
            $gte: today,
            $lt: tomorrow,
          },
        });

        // Only send reminder if not completed today
        if (!completedToday) {
          console.log(`📧 Sending reminder for habit "${habit.title}" to ${user.email}`);
          const sent = await sendHabitReminder(
            user.email,
            user.name || 'User',
            habit.title,
            habit.description
          );
          if (!sent) {
            console.warn(`   ⚠️  Failed to send reminder to ${user.email}`);
          }
        }
      }

      console.log(`[Reminder Job] Processed ${habits.length} habits`);
    } catch (error) {
      console.error('[Reminder Job] Error:', error);
    }
  });

  console.log('Reminder job scheduled: runs every hour at :00');
};

