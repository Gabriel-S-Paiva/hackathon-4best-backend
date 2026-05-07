import { Prof, User, Activity, ListItem } from "../models/db.config.js";

// Create a new proof (prof)
export const createProof = async (req, res, next) => {
  try {
    const {
      userId,
      activityId,
      listItemId = null,
      photoUrl,
      caption = null,
      shareToFeed = false,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return next({ status: 404, message: "User not found." });

    const activity = await Activity.findByPk(activityId);
    if (!activity) return next({ status: 404, message: "Activity not found." });

    if (listItemId) {
      const listItem = await ListItem.findByPk(listItemId);
      if (!listItem)
        return next({ status: 404, message: "List item not found." });
    }

    const proof = await Prof.create({
      userId,
      activityId,
      listItemId,
      photoUrl,
      caption,
      shareToFeed,
    });

    const response = {
      ...proof.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/proofs/${proof.id}` },
        { rel: "user", method: "GET", href: `/users/${proof.userId}` },
        {
          rel: "activity",
          method: "GET",
          href: `/activities/${proof.activityId}`,
        },
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

// Get all proofs
export const getAllProofs = async (req, res, next) => {
  try {
    const proofs = await Prof.findAll({ order: [["createdAt", "DESC"]] });
    const response = proofs.map((p) => ({
      ...p.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/proofs/${p.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};

// Get proof by id (expects middleware to attach `req.proof`)
export const getProofById = async (req, res, next) => {
  try {
    const proof = await req.proof;
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

// Update a proof (only caption and shareToFeed are updatable)
export const updateProof = async (req, res, next) => {
  try {
    const { caption, shareToFeed } = req.body;
    const proof = await req.proof;
    if (!proof) return next({ status: 404, message: "Proof not found." });
    await proof.update({ caption, shareToFeed });
    const response = {
      ...proof.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/proofs/${proof.id}` }],
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

// Delete a proof
export const deleteProof = async (req, res, next) => {
  try {
    const proof = await req.proof;
    if (!proof) return next({ status: 404, message: "Proof not found." });
    await proof.destroy();
    res.status(204).send();
  } catch (error) {
    return next({ status: 500, message: "Internal server error." });
  }
};
