import express from "express";
import { Tag, Activity } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

router.post("/activities/:activityId", async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    const tag = await Tag.findByPk(req.body.tagId);
    if (!activity || !tag) return res.status(404).json({ error: "Activity or tag not found" });
    await activity.addTag(tag);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete("/activities/:activityId/:tagId", async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    const tag = await Tag.findByPk(req.params.tagId);
    if (!activity || !tag) return res.status(404).json({ error: "Activity or tag not found" });
    await activity.removeTag(tag);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/:tagId", async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.tagId);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json(tag);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

export default router;
