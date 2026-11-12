import { Router } from "express";
import { body, param } from "express-validator";
import {
  createAdminRecord,
  deleteAdminRecord,
  listAdminRecords,
  updateAdminRecord
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authenticate.js";
import { requireTrustedOrigin } from "../middleware/trustedOrigin.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();
const validResource = param("resource").isIn(["projects", "skills", "experience", "posts"]);

function validateAdminPayload(request) {
  const value = request.body;
  const resource = request.params.resource;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("A JSON record is required.");
  }
  const isText = (field, minimum, maximum, required = false) => {
    const item = value[field];
    if (item === undefined && !required) return true;
    return typeof item === "string" && item.trim().length >= minimum && item.length <= maximum;
  };
  const isStringArray = (field, required = false) =>
    (value[field] === undefined && !required) ||
    (Array.isArray(value[field]) && value[field].length <= 50 && value[field].every((item) => typeof item === "string" && item.length <= 80));
  const isHttpsUrl = (field, required = false) => {
    if (value[field] == null || value[field] === "") return !required;
    if (typeof value[field] !== "string") return false;
    try {
      return new URL(value[field]).protocol === "https:";
    } catch {
      return false;
    }
  };
  let valid = false;

  if (resource === "projects") {
    valid =
      isText("title", 1, 120, true) &&
      isText("slug", 1, 120, true) &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug || "") &&
      isText("summary", 1, 300, true) &&
      isText("description", 1, 5000, true) &&
      isText("category", 1, 80, true) &&
      isHttpsUrl("githubUrl", true) &&
      isHttpsUrl("liveUrl") &&
      isHttpsUrl("demoUrl") &&
      isStringArray("techStack", true);
  } else if (resource === "skills") {
    valid = isText("group", 1, 100, true) && isStringArray("items", true);
  } else if (resource === "posts") {
    valid =
      isText("title", 1, 180, true) &&
      isText("excerpt", 1, 1500, true) &&
      isHttpsUrl("url", true);
  } else {
    valid =
      ["experience", "education"].includes(value.type) &&
      [value.title, value.qualification, value.organization, value.institution].some((item) => typeof item === "string" && item.trim().length > 0) &&
      ["title", "qualification", "organization", "institution", "location", "startDate", "endDate", "description", "result", "status"].every((field) => value[field] === undefined || (typeof value[field] === "string" && value[field].length <= 5000));
  }
  if (!valid) throw new Error("The record contains missing or invalid fields.");
  return true;
}

router.use(requireAdmin);
router.use(requireTrustedOrigin);
router.get("/:resource", validResource, validateRequest, listAdminRecords);
router.post(
  "/:resource",
  validResource,
  body().custom((_value, { req }) => validateAdminPayload(req)),
  validateRequest,
  createAdminRecord
);
router.put(
  "/:resource/:id",
  validResource,
  param("id").isString().isLength({ min: 1, max: 160 }),
  body().custom((_value, { req }) => validateAdminPayload(req)),
  validateRequest,
  updateAdminRecord
);
router.delete(
  "/:resource/:id",
  validResource,
  param("id").isString().isLength({ min: 1, max: 160 }),
  validateRequest,
  deleteAdminRecord
);

export default router;
