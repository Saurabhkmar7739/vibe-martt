const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { getUsers, getOrders } = require("../controllers/adminController");

router.get("/users", auth, admin, getUsers);
router.get("/orders", auth, admin, getOrders);

module.exports = router;