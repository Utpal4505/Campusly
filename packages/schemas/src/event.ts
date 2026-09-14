import { z } from "zod";

export const eventCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.date().or(z.string()),
  location: z.string().nullable(),
  price: z.number().default(0),
  currency: z.string().default("INR"),
  creator: z.object({
    id: z.string(),
    name: z.string(),
  }),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  coverImage: z.string().nullable().optional(),
  registrationCount: z.number(),
});

export type EventCard = z.infer<typeof eventCardSchema>;

export const eventDetailSchema = eventCardSchema.extend({
  creator: z.object({
    id: z.string(),
    name: z.string(),
    department: z.string().nullable().optional(),
  }),
});

export type EventDetail = z.infer<typeof eventDetailSchema>;

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  date: z.date().or(z.string()),
  location: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  price: z.number().optional(),
  currency: z.string().optional(),
  interestIds: z.array(z.string()).optional(),
  interestNames: z.array(z.string()).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const verifyPaymentSchema = z.object({
  eventId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
