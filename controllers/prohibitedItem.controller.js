const ProhibitedItem = require("../models/prohibitedItem.model");

const getProhibitedItems = async (req, res) => {
  try {
    const prohibitedItems = await ProhibitedItem.find({});
    res.status(200).json(prohibitedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProhibitedItem = async (req, res) => {
  try {
    const prohibitedItem = await ProhibitedItem.create(req.body);
    res.status(200).json(prohibitedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProhibitedItems,
  createProhibitedItem,
};
