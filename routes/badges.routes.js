import express from "express";
import badgesController from "../controllers/badges.controller.js";

const router = express.Router();

router.get("/", badgesController.getBadges);
router.get("/user/:userId", badgesController.getUserBadges);
router.get("/:badgeId", badgesController.getBadge);
router.post("/", badgesController.createBadge);

export default router;
