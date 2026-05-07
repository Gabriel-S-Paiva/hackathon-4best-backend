import express from "express";
import listsController from "../controllers/lists.controllers.js";

const router = express.Router();

router.get("/", listsController.getLists);
router.get("/:listId", listsController.getList);
router.post("/", listsController.createList);
router.patch("/:listId", listsController.updateList);
router.delete("/:listId", listsController.deleteList);
router.post("/:listId/items", listsController.addListItem);
router.get("/:listId/items", listsController.getListItems);
router.delete("/:listId/items/:activityId", listsController.removeListItem);

export default router;
