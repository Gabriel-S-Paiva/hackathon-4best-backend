import { List, ListItem, Activity } from "../models/db.config.js";

export const createList = async (req, res, next) => {
  try {
    const { userId, name, description } = req.body;
    const list = await List.create({ userId, name, description });
    const response = {
      ...list.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/lists/${list.id}` }],
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

export const getAllLists = async (req, res, next) => {
  try {
    const lists = await List.findAll();
    const response = lists.map((list) => ({
      ...list.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/lists/${list.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getListById = async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return next({ status: 404, message: "List not found." });
    const response = {
      ...list.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/lists/${list.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const updateList = async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return next({ status: 404, message: "List not found." });
    await list.update(req.body);
    const response = {
      ...list.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/lists/${list.id}` }],
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

export const deleteList = async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return next({ status: 404, message: "List not found." });
    await list.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const addListItem = async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) return next({ status: 404, message: "List not found." });
    const activity = await Activity.findByPk(req.body.activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    const item = await ListItem.create({ listId: list.id, activityId: activity.id });
    res.status(201).json(item);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getListItems = async (req, res, next) => {
  try {
    const items = await ListItem.findAll({ where: { listId: req.params.listId }, include: [Activity] });
    res.status(200).json(items);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const removeListItem = async (req, res, next) => {
  try {
    const item = await ListItem.findOne({ where: { listId: req.params.listId, activityId: req.params.activityId } });
    if (!item) return next({ status: 404, message: "List item not found." });
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getLists: getAllLists,
  getList: getListById,
  createList,
  updateList,
  deleteList,
  addListItem,
  getListItems,
  removeListItem,
};
