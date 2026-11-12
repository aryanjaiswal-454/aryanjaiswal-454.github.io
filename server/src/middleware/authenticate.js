import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAdmin = asyncHandler(async (request, response, next) => {
  const token = request.cookies?.portfolio_admin;
  if (!token) return response.status(401).json({ error: "Authentication required." });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return response.status(401).json({ error: "Your session is invalid or expired." });
  }

  const user = await User.findById(payload.sub).select("_id email role");
  if (!user || user.role !== "admin") {
    return response.status(401).json({ error: "Authentication required." });
  }
  request.admin = user;
  next();
});
