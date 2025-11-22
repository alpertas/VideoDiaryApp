import { z } from 'zod';
import i18n from './i18n';

/**
 * Validation schema for video metadata form.
 * Used in both Add and Edit screens with react-hook-form.
 * All error messages are localized via i18n.
 */
export const videoMetadataSchema = z.object({
  name: z
    .string()
    .min(1, { message: i18n.t('validation.nameRequired') })
    .max(100, { message: i18n.t('validation.nameMaxLength') }),
  description: z
    .string()
    .max(500, { message: i18n.t('validation.descriptionMaxLength') })
    .optional(),
});

export type VideoMetadataFormData = z.infer<typeof videoMetadataSchema>;

/**
 * Validation schema for video selection.
 * Ensures selected video meets minimum duration requirements.
 */
export const videoSelectionSchema = z.object({
  uri: z.string().min(1, { message: i18n.t('validation.videoUriRequired') }),
  duration: z
    .number()
    .min(5000, { message: i18n.t('validation.videoDurationMin') }),
});

/**
 * Validation schema for video trim range.
 * Ensures the trim range is exactly 5 seconds.
 */
export const videoTrimSchema = z
  .object({
    startTime: z
      .number()
      .min(0, { message: i18n.t('validation.startTimePositive') }),
    endTime: z
      .number()
      .min(0, { message: i18n.t('validation.endTimePositive') }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: i18n.t('validation.endTimeAfterStart'),
  })
  .refine((data) => Math.abs(data.endTime - data.startTime - 5000) < 100, {
    message: i18n.t('validation.trimRangeExact'),
  });
