import { ListItem, List, Activity } from "../models/db.config.js";

// Controller to add an activity to a list (create list_item)
export const createListItem = async (req, res, next) => {
  try {
    const { listId, activityId } = req.body;

    const list = await List.findByPk(listId);
    if (!list) return next({ status: 404, message: "List not found." });

    const activity = await Activity.findByPk(activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });

    const item = await ListItem.create({ listId, activityId });
    const response = {
      ...item.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/list_items/${item.id}` },
        { rel: "list", method: "GET", href: `/lists/${listId}` },
        { rel: "activity", method: "GET", href: `/activities/${activityId}` },
      ],
    };
    res.status(201).json(response);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({
        status: 409,
        message: "Resource conflict.",
        errors: { list_item: ["This activity is already in the list."] },
      });
    }
    if (
      error.message &&
      error.message.includes("A list cannot contain more than 100 activities")
    ) {
      return next({ status: 400, message: error.message });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get all list items
export const getAllListItems = async (req, res, next) => {
  try {
    const items = await ListItem.findAll();
    const response = items.map((i) => ({
      ...i.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/list_items/${i.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get a list item by id (expects middleware to attach `req.listItem`)
export const getListItemById = async (req, res, next) => {
  try {
    const item = await req.listItem;
    if (!item) return next({ status: 404, message: "List item not found." });
    const response = {
      ...item.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/list_items/${item.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to delete a list item
export const deleteListItem = async (req, res, next) => {
  try {
    const item = await req.listItem;
    if (!item) return next({ status: 404, message: "List item not found." });
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
