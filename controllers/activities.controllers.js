import { Activity, ODS, Tag } from "../models/db.config.js";

export const createActivity = async (req, res, next) => {
  try {
    const { ods_n, title, description, isMarked = false, isCompleted = false } = req.body;
    const ods = await ODS.findByPk(ods_n);
    if (!ods) return next({ status: 404, message: "ODS not found." });
    const activity = await Activity.create({ ods_n, title, description, isMarked, isCompleted });
    const response = {
      ...activity.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/activities/${activity.id}` },
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

export const getAllActivities = async (req, res, next) => {
  try {
    const activities = await Activity.findAll();
    const response = activities.map((activity) => ({
      ...activity.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${activity.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    const response = {
      ...activity.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${activity.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    await activity.update(req.body);
    const response = {
      ...activity.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${activity.id}` }],
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

export const completeActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    await activity.update({ isCompleted: true });
    const response = {
      ...activity.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${activity.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const markActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    await activity.update({ isMarked: req.body.isMarked });
    const response = {
      ...activity.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${activity.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getActivities: getAllActivities,
  getActivity: getActivityById,
  createActivity,
  updateActivity,
  completeActivity,
  markActivity,
};
