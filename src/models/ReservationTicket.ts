export const TicketReservation = require("mongoose").model(
  "TicketReservation",
  {
    userId: { type: Object, required: true },
    ticketId: { type: Object, required: true },
    seats: { type: [Number], default: [] },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now, expires: 600 },
  }
);
