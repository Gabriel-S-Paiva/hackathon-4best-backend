import { Feed, Prof, User, Activity } from "../models/db.config.js";

// Create a feed post
export const createFeed = async (req, res, next) => {
  try {
    const { userId, profId, activityId = null, isPublic = true } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return next({ status: 404, message: "User not found." });

    const prof = await Prof.findByPk(profId);
    if (!prof) return next({ status: 404, message: "Proof not found." });

    if (activityId) {
      const activity = await Activity.findByPk(activityId);
      if (!activity)
        return next({ status: 404, message: "Activity not found." });
    }

    const feed = await Feed.create({ userId, profId, activityId, isPublic });

    const response = {
      ...feed.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/feed/${feed.id}` },
        { rel: "user", method: "GET", href: `/users/${feed.userId}` },
        { rel: "proof", method: "GET", href: `/proofs/${feed.profId}` },
      ],
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

// Get all public feed posts
export const getFeed = async (req, res, next) => {
  try {
    const posts = await Feed.findAll({
      where: { isPublic: true },
      order: [["createdAt", "DESC"]],
    });
    const response = posts.map((p) => ({
      ...p.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${p.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Get feed for a specific user
export const getUserFeed = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await Feed.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    const response = posts.map((p) => ({
      ...p.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${p.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Get a single feed item (expects middleware to attach `req.feed`)
export const getFeedItem = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const feed = req.feed ? await req.feed : await Feed.findByPk(feedId);
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

// Update a feed post (allow updating isPublic and likeCount)
export const updateFeed = async (req, res, next) => {
  try {
    const { isPublic, likeCount } = req.body;
    const feed = await req.feed;
    if (!feed) return next({ status: 404, message: "Feed item not found." });
    await feed.update({ isPublic, likeCount });
    const response = {
      ...feed.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/feed/${feed.id}` }],
    };
    res.status(200).json(response);
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

// Delete a feed post
export const deleteFeed = async (req, res, next) => {
  try {
    const feed = await req.feed;
    if (!feed) return next({ status: 404, message: "Feed item not found." });
    await feed.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
