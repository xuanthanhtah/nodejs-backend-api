import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const UpdateUserRequestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
