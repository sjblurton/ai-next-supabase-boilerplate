/**
 * Internal domain type for a validated contact message.
 * Only exists after a Boundary parse has succeeded — no runtime schema coupling.
 */
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/**
 * Result types for boundary parsing outcomes.
 */
export type ParseSuccess<T> = { success: true; data: T };
export type ParseFailure = { success: false; errors: Record<string, string> };
export type ParseResult<T> = ParseSuccess<T> | ParseFailure;
