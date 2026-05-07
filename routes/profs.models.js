import express from "express";
import { Prof, Feed } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const profs = await Prof.findAll();
    res.json(profs);
  } catch (err) {
    next(err);
  }
});

router.get("/:profId", async (req, res, next) => {
  try {
    const prof = await Prof.findByPk(req.params.profId);
    if (!prof) return res.status(404).json({ error: "Prof not found" });
    res.json(prof);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const prof = await Prof.create(req.body);
    if (req.body.shareToFeed) {
      await Feed.create({
        userId: prof.userId,
        profId: prof.id,
        activityId: prof.activityId,
        isPublic: true
      });
    }
    res.status(201).json(prof);
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const profs = await Prof.findAll({ where: { userId: req.params.userId } });
    res.json(profs);
  } catch (err) {
    next(err);
  }
});

export default router;
