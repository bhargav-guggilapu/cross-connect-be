const express = require("express");
const {
  getProhibitedItems,
  createProhibitedItem,
} = require("../controllers/prohibitedItem.controller");
const router = express.Router();

router.get("/", getProhibitedItems);
router.post("/", createProhibitedItem);

module.exports = router;
