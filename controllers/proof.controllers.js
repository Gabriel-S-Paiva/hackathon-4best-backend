import { Prof, User, Activity, ListItem } from "../models/db.config.js";

export const createProof = async (req, res, next) => {
  try {
    const { userId, activityId, listItemId = null, photoUrl, caption = null, shareToFeed = false } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return next({ status: 404, message: "User not found." });
    const activity = await Activity.findByPk(activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });
    if (listItemId) {
      const listItem = await ListItem.findByPk(listItemId);
      if (!listItem) return next({ status: 404, message: "List item not found." });
    }
    const proof = await Prof.create({ userId, activityId, listItemId, photoUrl, caption, shareToFeed });
    const response = {
      ...proof.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/proofs/${proof.id}` },
        { rel: "user", method: "GET", href: `/users/${proof.userId}` },
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

export const getAllProofs = async (req, res, next) => {
  try {
    const proofs = await Prof.findAll({ order: [["createdAt", "DESC"]] });
    const response = proofs.map((proof) => ({
      ...proof.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/proofs/${proof.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getProofById = async (req, res, next) => {
  try {
    const proof = await Prof.findByPk(req.params.profId);
    if (!proof) return next({ status: 404, message: "Proof not found." });
    const response = {
      ...proof.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/proofs/${proof.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export const getUserProofs = async (req, res, next) => {
  try {
    const proofs = await Prof.findAll({ where: { userId: req.params.userId }, order: [["createdAt", "DESC"]] });
    res.status(200).json(proofs);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

export default {
  getProfs: getAllProofs,
  getProf: getProofById,
  createProf: createProof,
  getUserProfs: getUserProofs,
};
