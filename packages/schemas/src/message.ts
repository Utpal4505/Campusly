import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  sender: z
    .object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable().optional(),
    })
    .optional(),
});

export const conversationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  peer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    yearOfStudy: z.number().nullable().optional(),
  }),
  lastMessage: z
    .object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      senderId: z.string(),
    })
    .nullable()
    .optional(),
  unreadCount: z.number().default(0),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
});

export type MessageItem = z.infer<typeof messageSchema>;
export type ConversationItem = z.infer<typeof conversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
