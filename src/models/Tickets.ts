export const Tickets = require("mongoose").model("Tickets", {
    origin: String,
    destination: String,
    departureDate: Date, 
    departureTime: String, 
    arrivalTime: String, 
    type: String,
    amenities: [String],
    company: String,
    companyLogo: String, 
    price: Number,
  });
  