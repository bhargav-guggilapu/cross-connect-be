const mongoose = require("mongoose");
const {
  AGENT_STATUS,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
  ORDER_STATUS,
} = require("../constants");

const OrderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Please provide the customer ID"],
    },

    agent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Please provide the agent ID"],
    },

    orderStatus: {
      type: String,
      required: [true, "Please enter order status"],
      enum: {
        values: [ORDER_STATUS.ACTIVE, ORDER_STATUS.IN_ACTIVE],
        message: "agent status must be either 'active' or 'in active'",
      },
    },

    agentStatus: {
      type: String,
      required: [true, "Please enter agent status"],
      enum: {
        values: [
          AGENT_STATUS.ORDERED,
          AGENT_STATUS.CONFIRMED,
          AGENT_STATUS.SHIPPED,
          AGENT_STATUS.COMPLETED,
        ],
        message:
          "agent status must be either 'ordered' or 'confirmed' or 'shipped' or 'completed'",
      },
    },

    customerStatus: {
      type: String,
      required: [true, "Please enter customer status"],
      enum: {
        values: [
          CUSTOMER_STATUS.DRAFT,
          CUSTOMER_STATUS.IN_PROGRESS,
          CUSTOMER_STATUS.DELIVERED,
        ],
        message:
          "customer status must be either 'draft' or 'in progress' or 'delivered'",
      },
    },

    inProgressStatus: {
      type: String,
      enum: {
        values: [
          IN_PROGRESS_STATUS.ORDER_PLACED,
          IN_PROGRESS_STATUS.COST_ESTIMATE,
          IN_PROGRESS_STATUS.ITEMS_GATHERING,
          IN_PROGRESS_STATUS.SHIPPING_ESTIMATE,
          IN_PROGRESS_STATUS.SHIPPED,
        ],
        message:
          "in progress status must be either 'ordered' or 'cost estimate' or 'items gathering' or 'shipping estimate' or 'shipped'",
      },
    },

    itemsCost: Number,
    packageWeight: Number,
    shippingCost: Number,
    trackingId: String,
    deliveredDate: String,
    tipAmount: Number,

    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },

        name: {
          type: String,
          required: [true, "Please provide the item name"],
        },
        description: String,
        quantity: {
          type: Number,
          required: [true, "Please provide the quantity"],
          min: [1, "Quantity must be at least 1"],
        },
        unit: {
          type: String,
          enum: {
            values: ["KG(s)", "Liter(s)", "Piece(s)"],
            message: "unit must be either 'kg' or 'liter' or 'piece'",
          },
        },
        storeName: String,
        cost: Number,
        weight: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
