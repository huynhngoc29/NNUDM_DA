const express = require("express");
const { auth } = require("../firebase");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  orders,
  orderStatus,
  getUsers,
  updateUserRole,
} = require("../controllers/admin");

// routes
router.get("/admin/orders", authCheck, adminCheck, orders);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);
router.get("/admin/users", authCheck, adminCheck, getUsers);
router.put("/admin/user-role", authCheck, adminCheck, updateUserRole);

module.exports = router;
