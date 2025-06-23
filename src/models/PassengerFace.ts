import mongoose from "mongoose";

const PassengerFaceSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tickets",
    required: true,
  },
  name: String,
  cpf: String,
  descriptor: [Number],
});

export const PassengerFace = mongoose.model(
  "PassengerFace",
  PassengerFaceSchema
);
