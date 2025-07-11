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
  registerFace,
  loginFace,
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
router.post("/register-face", authGuard, registerFace);
router.post("/login-face", loginFace);
router.post("/forgot-password", forgotPassword);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and authentication
 *   - name: Tickets
 *     description: Ticket creation and searching
 *   - name: Reservations
 *     description: Reservation handling and seat management
 *   - name: ValidatePassengers
 *     description: Passenger validation in boarding
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       422:
 *         description: Validation error or user already exists
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User authenticated
 *       422:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users/register-face:
 *   post:
 *     summary: Register facial recognition data for user authentication
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Registers the user's facial descriptor generated by the [face-api.js](https://github.com/justadudewhohacks/face-api.js) library.
 *       This descriptor is a Float32Array with 128 values representing facial features.
 *       It is typically extracted using `faceapi.computeFaceDescriptor(image)`.
 *
 *       **Example descriptor:**
 *       ```json
 *       [
 *         -0.0844, 0.0486, 0.0622, -0.0799, 0.0597, -0.0143, -0.0194, -0.0592,
 *         0.2085, -0.1029, 0.2323, -0.0090, -0.1590, -0.1066, 0.0228, 0.0893,
 *         ... (112 more values)
 *       ]
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descriptor:
 *                 type: array
 *                 description: 128-length array generated by face-api.js (Float32Array)
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Face recognition data registered
 *       400:
 *         description: Invalid data or missing descriptor
 */

/**
 * @swagger
 * /api/users/login-face:
 *   post:
 *     summary: Authenticate user via face recognition
 *     tags: [Users]
 *     description: >
 *       Authenticates the user by comparing the submitted face descriptor (from face-api.js) with the stored descriptor.
 *       If the Euclidean distance between descriptors is below a defined threshold (e.g., 0.6), login is granted.
 *       The descriptor must be the same format as returned by `faceapi.computeFaceDescriptor()`.
 *
 *       **Example descriptor:**
 *       ```json
 *       [
 *         -0.0844, 0.0486, 0.0622, -0.0799, 0.0597, -0.0143, -0.0194, -0.0592,
 *         0.2085, -0.1029, 0.2323, -0.0090, -0.1590, -0.1066, 0.0228, 0.0893,
 *         ... (112 more values)
 *       ]
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descriptor:
 *                 type: array
 *                 description: 128-length array generated by face-api.js (Float32Array)
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Face matched and token returned
 *       400:
 *         description: Missing descriptor
 *       401:
 *         description: Face not recognized
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/update-info:
 *   put:
 *     summary: Update user information (CPF and birth date)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User info updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       422:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/users/add-user-ticket/{id}:
 *   put:
 *     summary: Add ticket to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               userSeats:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Ticket added to user
 */

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Send reset password email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/confirm-reset:
 *   get:
 *     summary: Confirm reset password using token
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset token
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
