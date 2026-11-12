import { isAllowedOrigin } from "../config/env.js";

export function requireTrustedOrigin(request, response, next) {
  const origin = request.get("origin");
  // Browsers normally omit Origin on same-origin GET/HEAD requests. These routes
  // are read-only and remain protected by the admin session cookie.
  if (!origin && ["GET", "HEAD"].includes(request.method)) return next();
  if (origin && isAllowedOrigin(origin)) return next();
  return response.status(403).json({ error: "This request origin is not allowed." });
}
