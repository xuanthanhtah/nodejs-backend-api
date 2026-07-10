import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
  role: z.string().min(1),
});

export const UpdateUserRequestSchema = z.object({
  displayName: z.string().min(1),
  role: z.string().min(1),
});
