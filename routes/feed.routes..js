import express from "express";
import feedController from "../controllers/feed.controllers.js";

const router = express.Router();

router.get("/", feedController.getFeed);
router.get("/user/:userId", feedController.getUserFeed);
router.get("/:feedId", feedController.getFeedItem);

export default router;
