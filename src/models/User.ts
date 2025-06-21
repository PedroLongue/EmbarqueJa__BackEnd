const TicketUser = {
  ticketId: String,
  paymentMethod: {
    type: String,
    enum: ["credit-card", "pix"],
    required: true,
  },
  userSeats: { type: [Number], required: true },
};

export const User = require("mongoose").model("User", {
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  cpf: { type: String, required: false },
  birthDate: { type: Date, required: false },
  userTickets: { type: [TicketUser], default: [] },
  faceAuthDescriptor: {
    type: [Number],
    default: null,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});
