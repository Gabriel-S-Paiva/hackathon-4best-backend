import express from "express";
import odsController from "../controllers/ods.controller.js";

const router = express.Router();

router.get("/", odsController.getOds);
router.get("/:n_ods", odsController.getOdsById);

export default router;
