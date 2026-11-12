import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import {
  createContactMessage,
  listExperience,
  listGithubRepositories,
  listPosts,
  listProjects,
  listSkills
} from "../controllers/publicController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many messages were submitted. Please try again later." }
});

router.get("/projects", listProjects);
router.get("/skills", listSkills);
router.get("/experience", listExperience);
router.get("/posts", listPosts);
router.get("/github/repos", listGithubRepositories);
router.post(
  "/contact",
  contactLimiter,
  body("name").isString().trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail().isLength({ max: 254 }),
  body("subject").isString().trim().isLength({ min: 3, max: 120 }),
  body("message").isString().trim().isLength({ min: 20, max: 4000 }),
  validateRequest,
  createContactMessage
);

export default router;
