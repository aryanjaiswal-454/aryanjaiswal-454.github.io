import { validationResult } from "express-validator";

export function validateRequest(request, response, next) {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    return response.status(400).json({
      error: "Please correct the highlighted fields.",
      details: result.array().map((error) => ({ field: error.path, message: error.msg }))
    });
  }
  next();
}
