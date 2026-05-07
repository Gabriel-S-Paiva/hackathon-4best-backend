import express from "express";
import { User, Follow, Community, Badge, Feed, Prof, List } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.patch("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/followers", async (req, res, next) => {
  try {
    const followers = await User.findByPk(req.params.userId, {
      include: [{ model: User, as: "Followers" }]
    });
    if (!followers) return res.status(404).json({ error: "User not found" });
    res.json(followers.Followers);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/following", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: User, as: "Following" }]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.Following);
  } catch (err) {
    next(err);
  }
});

router.post("/:userId/follow", async (req, res, next) => {
  try {
    const follower = await User.findByPk(req.params.userId);
    const following = await User.findByPk(req.body.targetUserId);
    if (!follower || !following) return res.status(404).json({ error: "User not found" });
    await follower.addFollowing(following);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete("/:userId/follow", async (req, res, next) => {
  try {
    const follower = await User.findByPk(req.params.userId);
    const following = await User.findByPk(req.body.targetUserId);
    if (!follower || !following) return res.status(404).json({ error: "User not found" });
    await follower.removeFollowing(following);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/communities", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Community }]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.Communities);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/badges", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Badge }]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.Badges);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/feed", async (req, res, next) => {
  try {
    const feed = await Feed.findAll({ where: { userId: req.params.userId } });
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/profs", async (req, res, next) => {
  try {
    const profs = await Prof.findAll({ where: { userId: req.params.userId } });
    res.json(profs);
  } catch (err) {
    next(err);
  }
});

export default router;
