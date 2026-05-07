import { Badge, User, ODS } from "../models/db.config.js";

export const createBadge = async (req, res, next) => {
  try {
    const { text, ods_n } = req.body;
    if (ods_n) {
      const ods = await ODS.findByPk(ods_n);
      if (!ods) return next({ status: 404, message: "ODS not found." });
    }
    const badge = await Badge.create({ text, ods_n });
    const response = {
      ...badge.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/badges/${badge.id}` }],
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
      return next({ status: 409, message: "Resource conflict.", errors: { text: ["Badge text must be unique."] } });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getAllBadges = async (req, res, next) => {
  try {
    const badges = await Badge.findAll();
    const response = badges.map((badge) => ({
      ...badge.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/badges/${badge.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getBadgeById = async (req, res, next) => {
  try {
    const badge = await Badge.findByPk(req.params.badgeId);
    if (!badge) return next({ status: 404, message: "Badge not found." });
    const response = {
      ...badge.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/badges/${badge.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: [{ model: Badge }] });
    if (!user) return next({ status: 404, message: "User not found." });
    res.status(200).json(user.Badges || []);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getBadges: getAllBadges,
  getBadge: getBadgeById,
  createBadge,
  getUserBadges,
};
