import { Activity, ODS, Tag } from "../models/db.config.js";

// Controller to create a new Activity
export const createActivity = async (req, res, next) => {
  try {
    const {
      ods_n,
      title,
      description,
      isMarked = false,
      isCompleted = false,
    } = req.body;

    // Optionally validate referenced ODS exists
    const ods = await ODS.findByPk(ods_n);
    if (!ods) {
      return next({ status: 404, message: "ODS not found." });
    }

    const activity = await Activity.create({
      ods_n,
      title,
      description,
      isMarked,
      isCompleted,
    });

    const response = {
      ...activity.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/activities/${activity.id}` },
        { rel: "ods", method: "GET", href: `/ods/${activity.ods_n}` },
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

// Controller to get all activities
export const getAllActivities = async (req, res, next) => {
  try {
    const activities = await Activity.findAll();
    const response = activities.map((a) => ({
      ...a.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/activities/${a.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get activity by id (expects middleware to attach `req.activity`)
export const getActivityById = async (req, res, next) => {
  try {
    const activity = await req.activity;
    if (!activity) return next({ status: 404, message: "Activity not found." });
    const response = {
      ...activity.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/activities/${activity.id}` },
      ],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to update an activity
export const updateActivity = async (req, res, next) => {
  try {
    const { title, description, isMarked, isCompleted } = req.body;
    const activity = await req.activity;
    if (!activity) return next({ status: 404, message: "Activity not found." });
    await activity.update({ title, description, isMarked, isCompleted });
    const response = {
      ...activity.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/activities/${activity.id}` },
      ],
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

// Controller to delete an activity
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await req.activity;
    if (!activity) return next({ status: 404, message: "Activity not found." });
    await activity.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
