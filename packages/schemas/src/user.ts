import { z } from "zod";

export const updatePreferencesSchema = z.object({
  interestIds: z.array(z.string()).min(1, "Please select at least one interest"),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  yearOfStudy: z.number().nullable().optional(),
  createdAt: z.date().or(z.string()),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
