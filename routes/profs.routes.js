import express from "express";
import profsController from "../controllers/proof.controllers.js";

const router = express.Router();

router.get("/", profsController.getProfs);
router.get("/:profId", profsController.getProf);
router.post("/", profsController.createProf);
router.get("/user/:userId", profsController.getUserProfs);

export default router;
