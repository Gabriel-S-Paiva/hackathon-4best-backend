import express from "express";
import communitiesController from "../controllers/communities.controller.js";

const router = express.Router();

router.get("/", communitiesController.getCommunities);
router.get("/:communityId", communitiesController.getCommunity);
router.post("/", communitiesController.createCommunity);
router.patch("/:communityId", communitiesController.updateCommunity);
router.delete("/:communityId", communitiesController.deleteCommunity);
router.post("/:communityId/join", communitiesController.joinCommunity);
router.post("/:communityId/leave", communitiesController.leaveCommunity);
router.get("/:communityId/users", communitiesController.getCommunityUsers);

export default router;
