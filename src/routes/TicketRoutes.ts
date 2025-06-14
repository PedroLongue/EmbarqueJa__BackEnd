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
