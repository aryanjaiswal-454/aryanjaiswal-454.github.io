export function normalizeContactPayload(input) {
  return {
    name: String(input.name || "").trim(),
    email: String(input.email || "").trim().toLowerCase(),
    subject: String(input.subject || "").trim(),
    message: String(input.message || "").trim()
  };
}

export function contactPayloadErrors(input) {
  const errors = [];
  if (input.name.length < 2 || input.name.length > 80) errors.push("Name must be 2 to 80 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.email.length > 254) errors.push("Enter a valid email address.");
  if (input.subject.length < 3 || input.subject.length > 120) errors.push("Subject must be 3 to 120 characters.");
  if (input.message.length < 20 || input.message.length > 4000) errors.push("Message must be 20 to 4000 characters.");
  return errors;
}

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
