import express from "express";
import { List, ListItem, Activity } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const lists = await List.findAll();
    res.json(lists);
  } catch (err) {
    next(err);
  }
});

router.get("/:listId", async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found" });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const list = await List.create(req.body);
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
});

router.patch("/:listId", async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found" });
    await list.update(req.body);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.delete("/:listId", async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found" });
    await list.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/:listId/items", async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found" });
    const item = await ListItem.create({ listId: list.id, activityId: req.body.activityId });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.get("/:listId/items", async (req, res, next) => {
  try {
    const items = await ListItem.findAll({ where: { listId: req.params.listId }, include: [Activity] });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.delete("/:listId/items/:activityId", async (req, res, next) => {
  try {
    const item = await ListItem.findOne({ where: { listId: req.params.listId, activityId: req.params.activityId } });
    if (!item) return res.status(404).json({ error: "List item not found" });
    await item.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
