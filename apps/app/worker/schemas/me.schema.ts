import { schema } from '@club/db';
import { z } from '@hono/zod-openapi';

export const meSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
  roles: z.array(z.enum(schema.roles)),
  status: z.enum(['active', 'disabled', 'pending']),
});

export const apiErrorSchema = z.object({ error: z.string() });

export type Me = z.infer<typeof meSchema>;
