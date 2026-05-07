import { Badge, ODS } from "../models/db.config.js";

// Controller to create a new Badge
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
      return next({
        status: 409,
        message: "Resource conflict.",
        errors: { text: ["Badge text must be unique."] },
      });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get all badges
export const getAllBadges = async (req, res, next) => {
  try {
    const badges = await Badge.findAll();
    const response = badges.map((b) => ({
      ...b.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/badges/${b.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get a badge by id (expects middleware to attach `req.badge`)
export const getBadgeById = async (req, res, next) => {
  try {
    const badge = await req.badge;
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

// Controller to update a badge
export const updateBadge = async (req, res, next) => {
  try {
    const { text, ods_n } = req.body;
    const badge = await req.badge;
    if (!badge) return next({ status: 404, message: "Badge not found." });

    if (ods_n) {
      const ods = await ODS.findByPk(ods_n);
      if (!ods) return next({ status: 404, message: "ODS not found." });
    }

    await badge.update({ text, ods_n });
    const response = {
      ...badge.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/badges/${badge.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({
        status: 409,
        message: "Resource conflict.",
        errors: { text: ["Badge text must be unique."] },
      });
    }
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

// Controller to delete a badge
export const deleteBadge = async (req, res, next) => {
  try {
    const badge = await req.badge;
    if (!badge) return next({ status: 404, message: "Badge not found." });
    await badge.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
