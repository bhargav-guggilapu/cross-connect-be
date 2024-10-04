const express = require("express");
const router = express.Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getByEmail,
  getAgentsByZipCode,
} = require("../controllers/user.controller.js");

router.get("/", getUsers);
router.get("/getByEmail", getByEmail);
router.get("/getAgentsByZipCode", getAgentsByZipCode);

router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
