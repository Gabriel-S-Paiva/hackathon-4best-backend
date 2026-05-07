import express from "express";
import tagsController from "../controllers/tags.controllers.js";

const router = express.Router();

router.get("/", tagsController.getTags);
router.post("/", tagsController.createTag);
router.post("/activities/:activityId", tagsController.addTagToActivity);
router.delete("/activities/:activityId/:tagId", tagsController.removeTagFromActivity);
router.get("/:tagId", tagsController.getTag);

export default router;
