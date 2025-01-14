import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(20, { message: 'Password is too long' }),
});

export const signUpSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(3, { message: 'Please provide your first name' }),
    lastName: z.string().optional(),
    password: z
      .string()
      .min(8, { message: 'Password is too short' })
      .max(20, { message: 'Password is too long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password is too short' })
      .max(20, { message: 'Password is too long' }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );

export const accountSetupSchema = z.object({
  usage: z.string().optional(),
  jobField: z.string().optional(),
  companyName: z.string().optional(),
  industryType: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  workspace: z.object({
    name: z.string().min(1, 'Provide a name for this workspace'),
    description: z.string().optional(),
  }),
});

export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(500, {
      message: 'Bio must not be longer than 500 characters.',
    })
    .optional(),
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  usage: z.enum(['personal', 'business']),
  companyName: z.string().optional(),
  industryType: z.string().optional(),
  numberOfEmployees: z.number().optional(),
  job: z.string().optional(),
  subscriptionPlan: z.enum(['free', 'pro', 'enterprise']),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Provide a name for this workspace'),
  description: z.string().min(1, 'Provide a description for this workspace'),
});

export const createReviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().min(5, 'Email is required'),
  review: z.string().min(10, 'Review must be at least 10 characters'),
  ratings: z
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must be less than or equal to 5'),
  profileImage: z.any().optional(),
});

export const requestTestimonialSchema = z.object({
  email: z.string().email(),
});
