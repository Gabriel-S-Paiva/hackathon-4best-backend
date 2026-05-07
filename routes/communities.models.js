import express from "express";
import { Community, User } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const communities = await Community.findAll();
    res.json(communities);
  } catch (err) {
    next(err);
  }
});

router.get("/:communityId", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.json(community);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const community = await Community.create(req.body);
    res.status(201).json(community);
  } catch (err) {
    next(err);
  }
});

router.patch("/:communityId", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });
    await community.update(req.body);
    res.json(community);
  } catch (err) {
    next(err);
  }
});

router.delete("/:communityId", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });
    await community.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/:communityId/join", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    const user = await User.findByPk(req.body.userId);
    if (!community || !user) return res.status(404).json({ error: "User or community not found" });
    await community.addUser(user, { through: { role: req.body.role ?? "member" } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/:communityId/leave", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    const user = await User.findByPk(req.body.userId);
    if (!community || !user) return res.status(404).json({ error: "User or community not found" });
    await community.removeUser(user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/:communityId/users", async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId, {
      include: [User]
    });
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.json(community.Users);
  } catch (err) {
    next(err);
  }
});

export default router;
