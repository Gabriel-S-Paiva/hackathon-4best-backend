import express from "express";
import { Activity, Prof, Feed, completeActivityWithBadge } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

router.get("/:activityId", async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
});

router.patch("/:activityId", async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    await activity.update(req.body);
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

router.post("/:activityId/complete", async (req, res, next) => {
  try {
    const { userId, listItemId, photoUrl, caption, shareToFeed = false } = req.body;
    const result = await completeActivityWithBadge(userId, req.params.activityId);
    const activity = result.activity;

    if (!activity) return res.status(404).json({ error: "Activity not found" });

    if (photoUrl) {
      const prof = await Prof.create({
        userId,
        activityId: activity.id,
        listItemId,
        photoUrl,
        caption,
        shareToFeed
      });

      if (shareToFeed) {
        await Feed.create({
          userId,
          profId: prof.id,
          activityId: activity.id,
          isPublic: true
        });
      }
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.patch("/:activityId/mark", async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    await activity.update({ isMarked: req.body.isMarked });
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

export default router;
