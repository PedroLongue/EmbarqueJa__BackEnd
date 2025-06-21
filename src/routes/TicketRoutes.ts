const router = require("express").Router();

import {
  createTicket,
  getTickets,
  getTicketById,
  searchTickets,
} from "../controllers/TicketController";
import {
  cancelReservation,
  confirmReservation,
  createTicketReservation,
  getPendingReservation,
  sendTicketEmail,
} from "../controllers/TicketReservation";

import { validate } from "../middlewares/handleValidation";
import { ticketValidation } from "../middlewares/ticketValidation";

router.post("/create", ticketValidation(), validate, createTicket);
router.get("/search", searchTickets);
router.post("/reservations", createTicketReservation);
router.post("/senderTicket", sendTicketEmail);
router.get("/reservations/:userId", getPendingReservation);
router.patch("/reservations/:reservationId/confirm", confirmReservation);
router.delete("/reservations/:reservationId", cancelReservation);
router.get("/", getTickets);
router.get("/:id", getTicketById);

module.exports = router;

/**
 * @swagger
 * /api/tickets/create:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - departureDate
 *               - departureTime
 *               - arrivalTime
 *               - type
 *               - company
 *               - price
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               departureDate:
 *                 type: string
 *                 format: date
 *               departureTime:
 *                 type: string
 *               arrivalTime:
 *                 type: string
 *               type:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               company:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tickets/search:
 *   get:
 *     summary: Search tickets by origin, destination, and date
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: departureDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of matching tickets
 *       400:
 *         description: Missing or invalid search parameters
 *       404:
 *         description: No tickets found
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all available tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of tickets
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket found
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/tickets/reservations:
 *   post:
 *     summary: Create a new reservation for a ticket
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - ticketId
 *               - seats
 *             properties:
 *               userId:
 *                 type: string
 *               ticketId:
 *                 type: string
 *               seats:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Missing or invalid fields
 *       409:
 *         description: Pending reservation already exists
 */

/**
 * @swagger
 * /api/tickets/reservations/{userId}:
 *   get:
 *     summary: Get pending reservation by user ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pending reservation found
 *       404:
 *         description: No pending reservation
 */

/**
 * @swagger
 * /api/tickets/reservations/{reservationId}/confirm:
 *   patch:
 *     summary: Confirm a pending reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation confirmed
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /api/tickets/reservations/{reservationId}:
 *   delete:
 *     summary: Cancel a reservation and release seats
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /api/tickets/senderTicket:
 *   post:
 *     summary: Send ticket details to user's email
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - origin
 *               - destination
 *               - departureDate
 *               - departureTime
 *               - seats
 *             properties:
 *               email:
 *                 type: string
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               departureDate:
 *                 type: string
 *                 format: date
 *               departureTime:
 *                 type: string
 *               seats:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 */
