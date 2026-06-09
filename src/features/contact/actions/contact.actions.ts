import { contactFormSchema } from "../schemas/contact-form.schema";
import type {
  ContactMessage,
  ParseFailure,
  ParseResult,
  ParseSuccess,
} from "../types/contact.types";

/**
 * Parses untrusted form input at the Boundary.
 * Returns a discriminated union — success carries a plain ContactMessage,
 * failure carries shaped field-level errors.
 */
export function parseContactForm(
  raw: unknown,
): ParseResult<ContactMessage> {
  const result = contactFormSchema.safeParse(raw);

  if (!result.success) {
    const errors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, msgs]) => [
        key,
        msgs?.[0] ?? "Invalid value",
      ]),
    );
    return { success: false, errors } satisfies ParseFailure;
  }

  return { success: true, data: result.data } satisfies ParseSuccess<ContactMessage>;
}

/**
 * Domain logic that operates only on trusted, already-parsed ContactMessage.
 * No Zod — plain TypeScript from here.
 */
export function formatContactSummary(message: ContactMessage): string {
  return `From: ${message.name} <${message.email}> — ${message.message.slice(0, 60)}${message.message.length > 60 ? "…" : ""}`;
}
