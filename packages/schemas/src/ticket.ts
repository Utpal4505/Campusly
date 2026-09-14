import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.string(),
  ticketNumber: z.string(),
  userId: z.string(),
  eventId: z.string(),
  registrationId: z.string(),
  qrCode: z.string(),
  status: z.enum(['CONFIRMED', 'CHECKED_IN', 'CANCELLED']).default('CONFIRMED'),
  createdAt: z.string(),
  updatedAt: z.string(),
  event: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable().optional(),
      date: z.string(),
      location: z.string().nullable().optional(),
      price: z.number().default(0),
      currency: z.string().default('INR'),
      interests: z.array(z.string()).default([]),
      creatorName: z.string().optional(),
    })
    .optional(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional(),
  registration: z
    .object({
      paymentStatus: z.string(),
      paymentId: z.string().nullable().optional(),
      orderId: z.string().nullable().optional(),
      amount: z.number().default(0),
    })
    .optional(),
});

export type TicketItem = z.infer<typeof ticketSchema>;

export const checkinTicketSchema = z.object({
  ticketNumberOrId: z.string().min(1, 'Ticket number or QR payload is required'),
  eventId: z.string().optional(),
});

export type CheckinTicketInput = z.infer<typeof checkinTicketSchema>;

export const ticketCheckinResultSchema = z.object({
  success: z.boolean(),
  status: z.enum(['CONFIRMED', 'CHECKED_IN', 'CANCELLED']),
  alreadyCheckedIn: z.boolean(),
  ticketNumber: z.string(),
  attendeeName: z.string(),
  attendeeEmail: z.string().optional(),
  eventTitle: z.string(),
  eventId: z.string(),
  checkedInAt: z.string(),
  message: z.string().optional(),
});

export type TicketCheckinResult = z.infer<typeof ticketCheckinResultSchema>;
