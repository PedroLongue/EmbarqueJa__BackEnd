const router = require("express").Router();

//Controller
import {
  register,
  login,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  userTicket,
  changePassword,
  registerFaceId,
  loginFaceId,
  forgotPassword,
  confirmResetPassword,
} from "../controllers/UserController";

//Middlewares
import { validate } from "../middlewares/handleValidation";
import {
  userCreateValidation,
  loginValidation,
} from "../middlewares/userValidation";

import { changePasswordValidation } from "../middlewares/userValidation";

import { authGuard } from "../middlewares/authGuard";
import { updateUserValidation } from "../middlewares/ticketValidation";

//Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.put(
  "/update-info",
  authGuard,
  updateUserValidation(),
  validate,
  updateUserInfo
);
router.put(
  "/change-password",
  changePasswordValidation(),
  authGuard,
  changePassword
);
router.put("/add-user-ticket/:id", userTicket);
router.get("/confirm-reset", confirmResetPassword);
router.get("/profile", authGuard, getCurrentUser);
router.get("/:id", getUserById);
router.post("/faceid", authGuard, registerFaceId);
router.post("/login-faceid", loginFaceId);
router.post("/forgot-password", forgotPassword);

module.exports = router;
