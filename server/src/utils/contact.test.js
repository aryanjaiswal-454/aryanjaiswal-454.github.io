import test from "node:test";
import assert from "node:assert/strict";
import { contactPayloadErrors, escapeHtml, normalizeContactPayload } from "./contact.js";

test("contact payload is trimmed and email normalized", () => {
  assert.deepEqual(normalizeContactPayload({
    name: "  Aryan  ",
    email: "  USER@Example.COM ",
    subject: " Hello ",
    message: " This is long enough to be a valid message. "
  }), {
    name: "Aryan",
    email: "user@example.com",
    subject: "Hello",
    message: "This is long enough to be a valid message."
  });
});

test("contact validation rejects short content and malformed email", () => {
  assert.equal(contactPayloadErrors({
    name: "A",
    email: "not-an-email",
    subject: "Hi",
    message: "short"
  }).length, 4);
});

test("email HTML escapes user-supplied content", () => {
  assert.equal(escapeHtml(`<script>alert("x")</script>`), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
});
