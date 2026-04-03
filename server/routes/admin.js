const express = require("express");

const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/auth");
const { getUsers, updateUserRole } = require("../controllers/admin");

router.get("/admin/users", authCheck, adminCheck, getUsers);
router.put("/admin/user-role", authCheck, adminCheck, updateUserRole);

module.exports = router;
