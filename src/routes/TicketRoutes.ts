const router = require("express").Router();

import {
  createTicket,
  getTickets,
  getTicketById,
} from "../controllers/TicketController";

import { validate } from "../middlewares/handleValidation";
import { ticketValidation } from "../middlewares/ticketValidation";

router.post("/create", ticketValidation(), validate, createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

module.exports = router;
