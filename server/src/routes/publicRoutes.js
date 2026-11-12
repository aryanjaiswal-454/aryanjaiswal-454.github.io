import { Router } from "express";
import {
  listExperience,
  listGithubRepositories,
  listPosts,
  listProjects,
  listSkills
} from "../controllers/publicController.js";

const router = Router();

router.get("/projects", listProjects);
router.get("/skills", listSkills);
router.get("/experience", listExperience);
router.get("/posts", listPosts);
router.get("/github/repos", listGithubRepositories);

export default router;
