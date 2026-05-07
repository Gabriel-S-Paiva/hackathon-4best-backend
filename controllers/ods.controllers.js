import { ODS } from "../models/db.config.js";

export const createODS = async (req, res, next) => {
  try {
    const { n_ods, title, description, icon } = req.body;
    const ods = await ODS.create({ n_ods, title, description, icon });
    const response = {
      ...ods.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/ods/${ods.n_ods}` }],
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
      return next({ status: 409, message: "Resource conflict.", errors: {} });
    }
    return next({ status: 500, message: "Internal server error." });
  }
};

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

export const getODSById = async (req, res, next) => {
  try {
    const ods = await ODS.findByPk(req.params.n_ods);
    if (!ods) return next({ status: 404, message: "ODS not found." });
    const response = {
      ...ods.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/ods/${ods.n_ods}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getOds: getAllODS,
  getOdsById: getODSById,
};
