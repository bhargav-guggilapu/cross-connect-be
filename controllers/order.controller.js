const { ORDER_STATUS } = require("../constants");
const Order = require("../models/order.model");

const getOrder = async (req, res) => {
  const filters = req.query;

  const order = await Order.find(filters);

  if (!order) {
    return res.status(404).json({
      message: `Order not found`,
    });
  }

  res.status(200).json(order);
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const filters = req.query;

    const order = await Order.findOneAndUpdate(filters, req.body, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByAgent = async (req, res) => {
  const { agent } = req.query;

  if (agent) {
    const orders = await Order.find({
      agent,
      orderStatus: ORDER_STATUS.ACTIVE,
    }).populate("customer");

    if (!orders) {
      return res
        .status(404)
        .json({ message: `Orders not found for agent: ${agent}` });
    }

    res.status(200).json(orders);
  } else {
    res.status(400).json({ message: "Agent ID is required" });
  }
};

module.exports = {
  getOrder,
  createOrder,
  updateOrder,
  getOrdersByAgent,
};
