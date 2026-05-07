import { User, Badge, Community, Feed, Prof } from "../models/db.config.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const response = {
      ...user.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/users/${user.id}` },
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
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({ status: 409, message: "Resource conflict.", errors: { email: ["A user with this email already exists."] } });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const response = users.map((user) => ({
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return next({ status: 404, message: "User not found." });
    const response = {
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return next({ status: 404, message: "User not found." });
    await user.update(req.body);
    const response = {
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({ status: 409, message: "Resource conflict.", errors: { email: ["A user with this email already exists."] } });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: User, as: "Followers" }],
    });
    if (!user) return next({ status: 404, message: "User not found." });
    res.status(200).json(user.Followers || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: User, as: "Following" }],
    });
    if (!user) return next({ status: 404, message: "User not found." });
    res.status(200).json(user.Following || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const followUser = async (req, res, next) => {
  try {
    const follower = await User.findByPk(req.params.userId);
    const following = await User.findByPk(req.body.targetUserId);
    if (!follower || !following) return next({ status: 404, message: "User not found." });
    await follower.addFollowing(following);
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const follower = await User.findByPk(req.params.userId);
    const following = await User.findByPk(req.body.targetUserId);
    if (!follower || !following) return next({ status: 404, message: "User not found." });
    await follower.removeFollowing(following);
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserCommunities = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Community }],
    });
    if (!user) return next({ status: 404, message: "User not found." });
    res.status(200).json(user.Communities || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Badge }],
    });
    if (!user) return next({ status: 404, message: "User not found." });
    res.status(200).json(user.Badges || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserFeed = async (req, res, next) => {
  try {
    const feed = await Feed.findAll({ where: { userId: req.params.userId } });
    res.status(200).json(feed);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserProfs = async (req, res, next) => {
  try {
    const profs = await Prof.findAll({ where: { userId: req.params.userId } });
    res.status(200).json(profs);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getUsers: getAllUsers,
  getUser: getUserById,
  createUser,
  updateUser,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  getUserCommunities,
  getUserBadges,
  getUserFeed,
  getUserProfs,
};
