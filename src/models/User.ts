export const User = require("mongoose").model("User", {
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});
