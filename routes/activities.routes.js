import express from "express";
import activitiesController from "../controllers/activities.controllers.js";

const router = express.Router();

router.get("/", activitiesController.getActivities);
router.get("/:activityId", activitiesController.getActivity);
router.post("/", activitiesController.createActivity);
router.patch("/:activityId", activitiesController.updateActivity);
router.post("/:activityId/complete", activitiesController.completeActivity);
router.patch("/:activityId/mark", activitiesController.markActivity);

export default router;
