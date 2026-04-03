const express = require("express");

const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/auth");
const { create, list, read, update, remove } = require("../controllers/role");

router.post("/role", authCheck, adminCheck, create);
router.get("/roles", list);
router.get("/role/:slug", read);
router.put("/role/:slug", authCheck, adminCheck, update);
router.delete("/role/:slug", authCheck, adminCheck, remove);

module.exports = router;
