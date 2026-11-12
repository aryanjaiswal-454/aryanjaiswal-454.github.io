import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || typeof password !== "string" || password.length < 1 || password.length > 200) {
    return response.status(400).json({ error: "Enter your administrator email and password." });
  }

  const user = await User.findOne({ email: normalizedEmail });
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || user.role !== "admin" || !passwordMatches) {
    return response.status(401).json({ error: "Email or password is incorrect." });
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
  response.cookie("portfolio_admin", token, cookieOptions());
  response.json({ email: user.email });
});

export const logout = (_request, response) => {
  response.clearCookie("portfolio_admin", cookieOptions());
  response.status(204).end();
};

export const currentAdmin = (request, response) => {
  response.json({ email: request.admin.email });
};
