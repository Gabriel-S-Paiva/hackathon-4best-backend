import express from "express";
import { ODS } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const ods = await ODS.findAll();
    res.json(ods);
  } catch (err) {
    next(err);
  }
});

router.get("/:n_ods", async (req, res, next) => {
  try {
    const ods = await ODS.findByPk(req.params.n_ods);
    if (!ods) return res.status(404).json({ error: "ODS not found" });
    res.json(ods);
  } catch (err) {
    next(err);
  }
});

export default router;
