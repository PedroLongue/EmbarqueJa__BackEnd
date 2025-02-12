const router = require("express").Router();

// Controller
import {
  createTicket,
  getTickets,
  getTicketById,
} from "../controllers/TicketController";

// Middlewares (caso precise de validações futuras)
import { validate } from "../middlewares/handleValidation";
import { ticketValidation } from "../middlewares/ticketValidation";

// Routes
router.post("/create", ticketValidation(), validate, createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

module.exports = router;
