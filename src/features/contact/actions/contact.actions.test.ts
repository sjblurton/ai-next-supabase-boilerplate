import { describe, expect, it } from "vitest";
import {
  formatContactSummary,
  parseContactForm,
} from "../actions/contact.actions";
import type { ContactMessage } from "../types/contact.types";

describe("parseContactForm (Boundary seam)", () => {
  it("accepts valid input and returns a plain ContactMessage", () => {
    const result = parseContactForm({
      name: "Jane Smith",
      email: "jane@example.com",
      message: "This is a valid message that is long enough.",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    const message: ContactMessage = result.data;
    expect(message.name).toBe("Jane Smith");
    expect(message.email).toBe("jane@example.com");
  });

  it("rejects input with missing name and shapes the error", () => {
    const result = parseContactForm({
      name: "",
      email: "jane@example.com",
      message: "This is a valid message that is long enough.",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors).toHaveProperty("name");
  });

  it("rejects input with an invalid email and shapes the error", () => {
    const result = parseContactForm({
      name: "Jane Smith",
      email: "not-an-email",
      message: "This is a valid message that is long enough.",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors).toHaveProperty("email");
  });

  it("rejects input with a message that is too short", () => {
    const result = parseContactForm({
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Too short",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors).toHaveProperty("message");
  });

  it("rejects completely unknown input and returns errors", () => {
    const result = parseContactForm(null);

    expect(result.success).toBe(false);
  });
});

describe("formatContactSummary (domain logic on trusted ContactMessage)", () => {
  it("formats a short message without truncation", () => {
    const message: ContactMessage = {
      name: "Jane Smith",
      email: "jane@example.com",
      message: "A short message.",
    };

    const summary = formatContactSummary(message);

    expect(summary).toBe("From: Jane Smith <jane@example.com> — A short message.");
  });

  it("truncates long messages at 60 characters with an ellipsis", () => {
    const message: ContactMessage = {
      name: "Jane",
      email: "j@example.com",
      message: "This message is deliberately long so that truncation kicks in at sixty chars.",
    };

    const summary = formatContactSummary(message);

    expect(summary).toContain("…");
    expect(summary.split("— ")[1].length).toBeLessThanOrEqual(61);
  });
});
