const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter first name"],
    },

    lastName: {
      type: String,
      required: [true, "Please enter last name"],
    },

    role: {
      type: String,
      required: [true, "Please enter role"],
      enum: {
        values: [ROLES.CUSTOMER, ROLES.AGENT],
        message: "Role must be either 'agent' or 'customer'",
      },
    },

    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
    },

    selectedAgent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },

    zipCode: String,
    phoneNumber: String,

    ordersDelivered: String,
    rating: String,
    photo: String,

    address: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
