import express from "express";
import usersController from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:userId", usersController.getUser);
router.post("/", usersController.createUser);
router.patch("/:userId", usersController.updateUser);
router.get("/:userId/followers", usersController.getFollowers);
router.get("/:userId/following", usersController.getFollowing);
router.post("/:userId/follow", usersController.followUser);
router.delete("/:userId/follow", usersController.unfollowUser);
router.get("/:userId/communities", usersController.getUserCommunities);
router.get("/:userId/badges", usersController.getUserBadges);
router.get("/:userId/feed", usersController.getUserFeed);
router.get("/:userId/profs", usersController.getUserProfs);

export default router;
