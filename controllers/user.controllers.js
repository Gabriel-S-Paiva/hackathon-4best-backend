/*
  Purpose: Controllers for user management: create, read, update,
  delete, authentication (login) and user-habit assignment. Each
  controller returns JSON responses enriched with HATEOAS links and
  forwards errors via `next()`.
*/
// Import users data
import jwt from "jsonwebtoken";
import { User, Activity } from "../models/db.config.js";

/**
 * createUser(req, res, next)
 * Creates a new user record using `name`, `email`, `password`
 * from the request body. Returns the created user
 * (HTTP 201) with HATEOAS links. Handles validation (400) and
 * unique constraint (409) errors by forwarding them to `next()`.
 */
// Controller to create a new user
export const createUser = async (req, res, next) => {
  3;
  try {
    const { name, email, password } = req.body;
    // Validate required fields and create user
    const user = await User.create({ name, email, password });

    // Include HATEOAS links in the response
    const response = {
      ...user.toJSON(),
      links: [
        { rel: "login", method: "POST", href: "/users/login" },
        { rel: "self", method: "GET", href: `/users/${user.id}` },
      ],
    };
    res.status(201).json(response);
  } catch (error) {
    // Handle specific errors: 400, 409 and 500
    if (error.name === "SequelizeValidationError") {
      const errors = {};

      error.errors.forEach((e) => {
        if (e.path === "email") {
          errors.email = ["Email is mandatory.", "Email must be valid."];
        }
        if (e.path === "password") {
          errors.password = [
            "Password must have between 12 and 15 characters.",
            "Password must include uppercase, lowercase, numbers and special characters.",
          ];
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
        errors: { email: ["A user with this email already exists."] },
      });
    }

    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * getAllUsers(req, res, next)
 * Retrieves all users (pagination/filtering TODO) and returns them
 * with HATEOAS `self` links. Forwards internal errors (500) via
 * `next()`.
 */
// Controller to get all users
export const getAllUsers = async (req, res, next) => {
  // Extract pagination and filtering parameters from query string
  const { page = 1, limit = 10, role } = req.query; // TODO: Implement filtering when the DB/Sequelize are ready

  try {
    const users = await User.findAll();
    console.log(`Found ${users.length} users in the database.`);

    // Include HATEOAS links in the response
    const response = users.map((user) => ({
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    }));
    res.status(200).json(response);
  } catch (error) {
    // Handle specific errors: 500
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * getUserById(req, res, next)
 * Returns a single user attached to `req.user` by earlier middleware.
 * If missing, forwards a 404. Adds a HATEOAS `self` link to the
 * response.
 */
// Controller to get a user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id_user } = req.params;
    const user = await req.user;

    if (!user) {
      return next({
        status: 404,
        message: "User not found.",
      });
    }

    // Include HATEOAS links in the response
    const response = {
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    // Handle specific errors: 500
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * updateUser(req, res, next)
 * Updates `email` and/or `password` on the user instance found at
 * `req.user`. Returns the updated resource with a `self` link. Handles
 * unique email conflicts (409) and internal errors.
 */
// Controller to update a user
export const updateUser = async (req, res, next) => {
  try {
    const { id_user } = req.params;
    const { email, password } = req.body;
    const user = await req.user;

    if (!user) {
      return next({
        status: 404,
        message: "User not found.",
      });
    }
    await user.update({ email, password });

    // Include HATEOAS links in the response
    const response = {
      ...user.toJSON(),
      links: [{ rel: "self", method: "GET", href: `/users/${user.id}` }],
    };
    res.status(200).json(response);
  } catch (error) {
    // Handle specific errors: 409 and 500
    if (error.name === "SequelizeUniqueConstraintError") {
      return next({
        status: 409,
        message: "Resource conflict.",
        errors: { email: ["A user with this email already exists."] },
      });
    }
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * deleteUser(req, res, next)
 * Deletes the user attached to `req.user`. Responds 204 on success or
 * forwards a 404 if the user does not exist.
 */
// Controller to delete a user
export const deleteUser = async (req, res, next) => {
  try {
    const { id_user } = req.params;
    const user = await req.user;

    if (!user) {
      return next({
        status: 404,
        message: "User not found.",
      });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    // Handle specific errors: 500
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * loginUser(req, res, next)
 * Authenticates a user by `email` and `password`. On success signs a
 * JWT and returns it alongside the user object and HATEOAS links.
 * Returns 401 on invalid credentials and 500 on internal errors.
 */
// Controller to login a user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } }); // TODO: Implement password hashing and secure comparison when the DB/Sequelize are ready

    if (!user) {
      return next({
        status: 401,
        message: "Invalid credentials.",
      });
    }

    if (user.password !== password) {
      return next({
        status: 401,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Include HATEOAS links in the response
    const response = {
      token,
      ...user.toJSON(),
      links: [
        { rel: "self", method: "GET", href: `/users/${user.id}` },
        { rel: "logout", method: "POST", href: "/users/logout" },
      ],
    };
    res.status(200).json(response);
  } catch (error) {
    // Handle specific errors: 500
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};

/**
 * assignActivityUser(req, res, next)
 * Associates a habit with a user. Validates presence of the user and
 * the habit, attaches the habit to the user via ORM helpers and
 * returns the updated user with links. Forwards 404 or 500 on error.
 */
// Controller to assign a task to a user
export const assignActivityUser = async (req, res, next) => {
  try {
    const { id_user } = req.params;
    const { id_activity } = req.body;
    const user = await req.user;

    if (!user) {
      return next({
        status: 404,
        message: "User not found.",
      });
    }

    const activity = await Activity.findByPk(id_activity);
    if (!activity) {
      return next({
        status: 404,
        message: "Activity not found.",
      });
    }
    await user.addActivity(activity);

    // Include HATEOAS links in the response
    const response = {
      ...user.toJSON(),
      links: [
        {
          rel: "self",
          method: "POST",
          href: `/users/${id_user}/activities/${id_activity}`,
        },
        {
          rel: "user_activities",
          method: "GET",
          href: `/users/${id_user}/activities`,
        },
      ],
    };
    res.status(200).json(response);
  } catch (error) {
    // Handle specific errors: 500
    return next({
      status: 500,
      message: "Internal server error.",
    });
  }
};
