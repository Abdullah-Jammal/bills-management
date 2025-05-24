import { z } from 'zod'

export const schema = z.object({
  billNumber: z.string().min(1, 'Required'),
  receiver: z.string().min(1, 'Required'),
  station: z.string().min(1, 'Required'),
  amount: z.coerce.number().min(1, 'Must be positive'),
  issuedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  executionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  status: z.enum(['pending', 'executed']),
  isPaid: z.coerce.boolean(),
})
