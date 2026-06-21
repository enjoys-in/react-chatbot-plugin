// ─── Booking Plugin ──────────────────────────────────────────────
// Calendar-based appointment booking within chat.
// Fetches available slots from API and confirms booking.

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface TimeSlot {
  id: string;
  date: string; // ISO date string
  time: string; // e.g., '10:00 AM'
  available: boolean;
}

export interface BookingConfirmation {
  bookingId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface BookingPluginOptions {
  /** API endpoint to fetch available slots (GET ?date=YYYY-MM-DD) */
  slotsEndpoint: string;
  /** API endpoint to confirm booking (POST) */
  bookEndpoint: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Callback on successful booking */
  onBooked?: (confirmation: BookingConfirmation) => void;
  /** Callback on cancelled booking */
  onCancelled?: (bookingId: string) => void;
  /** Flow step after booking confirmed */
  successStep?: string;
  /** Custom message format for available slots */
  slotsMessage?: (slots: TimeSlot[]) => string;
}

export function bookingPlugin(options: BookingPluginOptions): ChatPlugin {
  return {
    name: 'booking',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      // Fetch available slots for a date
      if (event.type === 'booking:getSlots') {
        const date = typeof event.payload === 'string' ? event.payload : new Date().toISOString().split('T')[0];

        ctx.addBotMessage(`📅 Checking available slots for ${date}...`);

        fetch(`${options.slotsEndpoint}?date=${date}`, {
          headers: options.headers,
        })
          .then((r) => r.json())
          .then((data: { slots?: TimeSlot[] }) => {
            const slots = (data.slots ?? data as unknown as TimeSlot[]).filter((s: TimeSlot) => s.available);

            if (slots.length === 0) {
              ctx.addBotMessage('📅 No available slots for this date. Please try another day.');
              ctx.emit('booking:noSlots', date);
              return;
            }

            const msg = options.slotsMessage
              ? options.slotsMessage(slots)
              : `📅 Available slots for ${date}:\n\n${slots.map((s, i) => `  ${i + 1}. ${s.time}`).join('\n')}\n\n_Reply with the slot number or time to book._`;

            ctx.addBotMessage(msg);
            ctx.setData('__availableSlots', slots);
            ctx.emit('booking:slots', slots);
          })
          .catch((err: Error) => {
            ctx.addBotMessage('📅 Unable to fetch available slots. Please try again.');
            ctx.emit('booking:error', err.message);
          });
      }

      // Confirm a booking
      if (event.type === 'booking:confirm') {
        const payload = event.payload as { slotId?: string; date?: string; time?: string; name?: string; email?: string } | undefined;
        if (!payload) return;

        ctx.addBotMessage('📅 Confirming your appointment...');

        fetch(options.bookEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...options.headers },
          body: JSON.stringify(payload),
        })
          .then((r) => r.json())
          .then((data: BookingConfirmation) => {
            options.onBooked?.(data);
            ctx.addBotMessage(`✅ Appointment confirmed!\n\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n🆔 Booking ID: ${data.bookingId}`);
            ctx.setData('__lastBooking', data);
            ctx.emit('booking:confirmed', data);
            if (options.successStep) ctx.emit('flow:goto', options.successStep);
          })
          .catch((err: Error) => {
            ctx.addBotMessage(`❌ Booking failed: ${err.message}. Please try again.`);
            ctx.emit('booking:error', err.message);
          });
      }

      // Cancel a booking
      if (event.type === 'booking:cancel' && typeof event.payload === 'string') {
        fetch(`${options.bookEndpoint}/${event.payload}`, {
          method: 'DELETE',
          headers: options.headers,
        })
          .then(() => {
            options.onCancelled?.(event.payload as string);
            ctx.addBotMessage(`🗑️ Booking ${event.payload} has been cancelled.`);
            ctx.emit('booking:cancelled', event.payload);
          })
          .catch(() => {
            ctx.addBotMessage('❌ Unable to cancel booking. Please try again.');
          });
      }
    },
  };
}
