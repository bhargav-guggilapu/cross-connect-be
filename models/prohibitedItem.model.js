const mongoose = require("mongoose");

const ProhibitedItemSchema = mongoose.Schema({
  item: String,
  description: String,
});

const ProhibitedItem = mongoose.model("ProhibitedItem", ProhibitedItemSchema);

module.exports = ProhibitedItem;
