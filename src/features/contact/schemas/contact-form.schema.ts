import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Name is required" })
    .max(100, { error: "Name is too long" }),
  email: z.email({ error: "A valid email address is required" }),
  message: z
    .string()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(1000, { error: "Message is too long" }),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
