const express = require("express");
const {
  createOrder,
  updateOrder,
  getOrder,
} = require("../controllers/order.controller");
const router = express.Router();

router.get("/", getOrder);
router.post("/", createOrder);
router.put("/", updateOrder);

module.exports = router;
