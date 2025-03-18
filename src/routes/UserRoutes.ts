const router = require("express").Router();

//Controller
import {
  register,
  login,
  getCurrentUser,
  getUserById,
} from "../controllers/UserController";

//Middlewares
import { validate } from "../middlewares/handleValidation";
import {
  userCreateValidation,
  loginValidation,
} from "../middlewares/userValidation";

import { changePasswordValidation } from "../middlewares/userValidation";
import { changePassword } from "../controllers/UserController";

import { authGuard } from "../middlewares/authGuard";

//Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.put(
  "/change-password",
  changePasswordValidation(),
  authGuard,
  changePassword
);
router.get("/profile", authGuard, getCurrentUser);
router.get("/:id", getUserById);

module.exports = router;
