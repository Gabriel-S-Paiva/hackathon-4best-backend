import { Community, User } from "../models/db.config.js";

export const getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.findAll();
    const response = communities.map((community) => ({
      ...community.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/communities/${community.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return next({ status: 404, message: "Community not found." });
    const response = {
      ...community.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/communities/${community.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const createCommunity = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const community = await Community.create({ name, description });
    const response = {
      ...community.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/communities/${community.id}` }],
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

export const updateCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return next({ status: 404, message: "Community not found." });
    await community.update(req.body);
    const response = {
      ...community.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/communities/${community.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    if (!community) return next({ status: 404, message: "Community not found." });
    await community.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const joinCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    const user = await User.findByPk(req.body.userId);
    if (!community || !user) return next({ status: 404, message: "User or community not found." });
    await community.addUser(user, { through: { role: req.body.role ?? "member" } });
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const leaveCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId);
    const user = await User.findByPk(req.body.userId);
    if (!community || !user) return next({ status: 404, message: "User or community not found." });
    await community.removeUser(user);
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getCommunityUsers = async (req, res, next) => {
  try {
    const community = await Community.findByPk(req.params.communityId, {
      include: [{ model: User }],
    });
    if (!community) return next({ status: 404, message: "Community not found." });
    res.status(200).json(community.Users || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityUsers,
};
