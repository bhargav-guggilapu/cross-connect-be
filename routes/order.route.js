const express = require("express");
const {
  createOrder,
  updateOrder,
  getOrder,
  getOrdersByAgent,
} = require("../controllers/order.controller");
const router = express.Router();

router.get("/", getOrder);
router.post("/", createOrder);
router.put("/", updateOrder);
router.get("/getOrdersByAgent", getOrdersByAgent);

module.exports = router;
