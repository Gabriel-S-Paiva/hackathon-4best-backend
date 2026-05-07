import { Tag, Activity } from "../models/db.config.js";

export const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    const response = tags.map((tag) => ({
      ...tag.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/tags/${tag.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.tagId);
    if (!tag) return next({ status: 404, message: "Tag not found." });

    const response = {
      ...tag.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/tags/${tag.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { text } = req.body;
    const tag = await Tag.create({ text });
    const response = {
      ...tag.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/tags/${tag.id}` }],
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
      return next({ status: 409, message: "Resource conflict.", errors: { text: ["Tag text must be unique."] } });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

export const addTagToActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    const tag = await Tag.findByPk(req.body.tagId);

    if (!activity || !tag) return next({ status: 404, message: "Activity or tag not found." });

    await activity.addTag(tag);
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const removeTagFromActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    const tag = await Tag.findByPk(req.params.tagId);

    if (!activity || !tag) return next({ status: 404, message: "Activity or tag not found." });

    await activity.removeTag(tag);
    res.status(204).end();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getTags,
  getTag,
  createTag,
  addTagToActivity,
  removeTagFromActivity,
};
