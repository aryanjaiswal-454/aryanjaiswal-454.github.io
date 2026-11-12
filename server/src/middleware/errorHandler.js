export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);

  if (error?.name === "ValidationError") {
    return response.status(400).json({ error: "The submitted record is invalid." });
  }
  if (error?.code === 11000) {
    return response.status(409).json({ error: "A record with that unique value already exists." });
  }

  const status = Number(error?.status || error?.statusCode);
  if (status >= 400 && status < 600) {
    return response.status(status).json({ error: error.publicMessage || "The request could not be completed." });
  }

  console.error("Unhandled API error", {
    method: request.method,
    path: request.path,
    name: error?.name || "Error"
  });
  return response.status(500).json({ error: "The server could not complete the request." });
}
