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

module.exports = {
  getOrder,
  createOrder,
  updateOrder,
};
