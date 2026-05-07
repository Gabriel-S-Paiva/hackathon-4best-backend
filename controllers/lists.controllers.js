import { List } from "../models/db.config.js";

// Controller to create a new List
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

// Controller to get all lists
export const getAllLists = async (req, res, next) => {
  try {
    const lists = await List.findAll();
    const response = lists.map((l) => ({
      ...l.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/lists/${l.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get a list by id (expects middleware to attach `req.list`)
export const getListById = async (req, res, next) => {
  try {
    const list = await req.list;
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

// Controller to update a list
export const updateList = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const list = await req.list;
    if (!list) return next({ status: 404, message: "List not found." });
    await list.update({ name, description });
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

// Controller to delete a list
export const deleteList = async (req, res, next) => {
  try {
    const list = await req.list;
    if (!list) return next({ status: 404, message: "List not found." });
    await list.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
