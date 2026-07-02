import { z } from 'zod';

export const jobCategories = [
  "FARMING", "CONSTRUCTION", "ELECTRICAL", "PLUMBING", 
  "PAINTING", "CARPENTRY", "CLEANING", "TRANSPORTATION", 
  "WELDING", "OTHER"
] as const;

export const urgencyLevels = [
  "LOW", "MEDIUM", "HIGH", "CRITICAL"
] as const;

export const jobStatus = [
  "OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"
] as const;

export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  category: z.enum(jobCategories),
  requiredSkills: z.string().optional(),
  requiredWorkers: z.coerce.number().min(1, "At least 1 worker required"),
  wage: z.coerce.number().min(1, "Wage must be greater than 0"),
  duration: z.string().optional(),
  urgencyLevel: z.enum(urgencyLevels),
  address: z.string().min(5, "Address must be at least 5 characters"),
  village: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  startDate: z.string().min(1, "Start date is required"),
  deadline: z.string().optional(),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
