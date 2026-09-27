import express from "express";
import {
  signup,
  login,
  updateUser,
  deleteUser,
  getUserById,
} from "./user.service.js";
import { asyncHandler } from "../../common/middleware/error-handling.middleware.js";

const router = express.Router();

// POST /users/signup
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { status, body } = await signup(req.body);

    res.status(status).json(body);
  }),
);

// POST /users/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { status, body } = await login(req.body);

    res.status(status).json(body);
  }),
);

// PATCH /users/:id
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status, body } = await updateUser(req.params.id, req.body);

    res.status(status).json(body);
  }),
);

// DELETE /users?id=<userId>
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { status, body } = await deleteUser(req.query.id);

    res.status(status).json(body);
  }),
);

// GET /users?id=<userId>
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status, body } = await getUserById(req.query.id);

    res.status(status).json(body);
  }),
);

export default router;
