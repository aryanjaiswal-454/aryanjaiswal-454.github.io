import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { currentAdmin, login, logout } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/authenticate.js";
import { requireTrustedOrigin } from "../middleware/trustedOrigin.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please try again later." }
});

router.post(
  "/login",
  loginLimiter,
  requireTrustedOrigin,
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 1, max: 200 }),
  validateRequest,
  login
);
router.get("/me", requireAdmin, currentAdmin);
router.post("/logout", requireTrustedOrigin, logout);

export default router;
