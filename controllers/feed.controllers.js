import { Feed, Prof, User, Activity } from "../models/db.config.js";

export const createFeed = async (req, res, next) => {
  try {
    const { userId, profId, activityId = null, isPublic = true } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return next({ status: 404, message: "User not found." });
    const prof = await Prof.findByPk(profId);
    if (!prof) return next({ status: 404, message: "Proof not found." });
    if (activityId) {
      const activity = await Activity.findByPk(activityId);
      if (!activity) return next({ status: 404, message: "Activity not found." });
    }
    const feed = await Feed.create({ userId, profId, activityId, isPublic });
    const response = {
      ...feed.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${feed.id}` }],
    };
    res.status(201).json(response);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = {};
      error.errors.forEach((e) => {
        errors[e.path] = errors[e.path] || [];
        errors[e.path].push(e.message);
      });
      return next({ status: 400, message: "Validation failed.", errors });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const posts = await Feed.findAll({ where: { isPublic: true }, order: [["createdAt", "DESC"]] });
    const response = posts.map((post) => ({
      ...post.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${post.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserFeed = async (req, res, next) => {
  try {
    const posts = await Feed.findAll({ where: { userId: req.params.userId }, order: [["createdAt", "DESC"]] });
    const response = posts.map((post) => ({
      ...post.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${post.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getFeedItem = async (req, res, next) => {
  try {
    const feed = await Feed.findByPk(req.params.feedId);
    if (!feed) return next({ status: 404, message: "Feed item not found." });
    const response = {
      ...feed.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${feed.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getFeed,
  getUserFeed,
  getFeedItem,
};
