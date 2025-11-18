import { z } from 'zod';

/**
 * Validation schema for video metadata form.
 * Used in both Add and Edit screens with react-hook-form.
 */
export const videoMetadataSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .default(''),
});

export type VideoMetadataFormData = z.infer<typeof videoMetadataSchema>;

/**
 * Validation schema for video selection.
 * Ensures selected video meets minimum duration requirements.
 */
export const videoSelectionSchema = z.object({
  uri: z.string().min(1, 'Video URI is required'),
  duration: z
    .number()
    .min(5000, 'Video must be at least 5 seconds long'),
});

/**
 * Validation schema for video trim range.
 * Ensures the trim range is exactly 5 seconds.
 */
export const videoTrimSchema = z.object({
  startTime: z.number().min(0, 'Start time must be positive'),
  endTime: z.number().min(0, 'End time must be positive'),
}).refine(
  (data) => data.endTime > data.startTime,
  { message: 'End time must be after start time' }
).refine(
  (data) => Math.abs((data.endTime - data.startTime) - 5000) < 100,
  { message: 'Trim range must be exactly 5 seconds' }
);

