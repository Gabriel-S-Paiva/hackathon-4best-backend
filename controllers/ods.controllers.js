import { ODS } from "../models/db.config.js";

// Controller to create a new ODS entry
export const createODS = async (req, res, next) => {
  try {
    const { n_ods, title, description, icon } = req.body;
    const ods = await ODS.create({ n_ods, title, description, icon });

    const response = {
      ...ods.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/ods/${ods.n_ods}` },
        {
          rel: "activities",
          method: "GET",
          href: `/ods/${ods.n_ods}/activities`,
        },
      ],
    };
    res.status(201).json(response);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = {};
      error.errors.forEach((e) => {
        if (e.path === "n_ods") {
          errors.n_ods = ["n_ods must be an integer between 1 and 17."];
        }
        if (e.path === "title") {
          errors.title = ["Title is mandatory."];
        }
        if (e.path === "description") {
          errors.description = ["Description is mandatory."];
        }
        if (e.path === "icon") {
          errors.icon = ["Icon is mandatory."];
        }
      });

      return next({
        status: 400,
        message: "Validation failed.",
        errors,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return next({
        status: 409,
        message: "Resource conflict.",
        errors: {},
      });
    }

    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get all ODS entries
export const getAllODS = async (req, res, next) => {
  try {
    const odsList = await ODS.findAll();

    const response = odsList.map((ods) => ({
      ...ods.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/ods/${ods.n_ods}` }],
    }));

    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to get a single ODS by id (expects middleware to attach `req.ods`)
export const getODSById = async (req, res, next) => {
  try {
    const { id_ods } = req.params;
    const ods = await req.ods;

    if (!ods) {
      return next({ status: 404, message: "ODS not found." });
    }

    const response = {
      ...ods.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/ods/${ods.n_ods}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to update an ODS entry
export const updateODS = async (req, res, next) => {
  try {
    const { id_ods } = req.params;
    const { title, description, icon } = req.body;
    const ods = await req.ods;

    if (!ods) {
      return next({ status: 404, message: "ODS not found." });
    }

    await ods.update({ title, description, icon });

    const response = {
      ...ods.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/ods/${ods.n_ods}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({ status: 409, message: "Resource conflict.", errors: {} });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

// Controller to delete an ODS entry
export const deleteODS = async (req, res, next) => {
  try {
    const { id_ods } = req.params;
    const ods = await req.ods;

    if (!ods) {
      return next({ status: 404, message: "ODS not found." });
    }

    await ods.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
