const { ROLES } = require("../constants");
const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByEmail = async (req, res) => {
  const email = req.query.email;

  if (email) {
    const user = await User.find({ email }).populate("selectedAgent");

    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: `User not found with email: ${email}` });
    }

    res.status(200).json(user);
  } else {
    res.status(400).json({ message: "Email ID is required" });
  }
};

const updateDeliveries = async (req, res) => {
  const id = req.query.id;

  if (id) {
    const user = await User.find({ _id: id });
    await User.findOneAndUpdate(
      { _id: id },
      {
        ordersDelivered: (user[0].ordersDelivered || 0) + 1,
      }
    );
    res.status(200).json({ message: "Orders delivered updated successfully" });
  } else {
    res.status(400).json({ message: "ID is required" });
  }
};

const getAgentsByZipCode = async (req, res) => {
  const zipCode = req.query.zipCode;

  if (zipCode) {
    const users = await User.find({
      role: ROLES.AGENT,
      "address.zipCode": zipCode,
    });

    if (!users) {
      return res
        .status(404)
        .json({ message: `Agents not found with zip code: ${zipCode}` });
    }

    res.status(200).json(users);
  } else {
    res.status(400).json({ message: "Zip code is required" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findById(id).populate("selectedAgent");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const User = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getByEmail,
  updateDeliveries,
  getAgentsByZipCode,
};
