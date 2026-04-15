const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { createOrder, getMyOrders, getAllOrders, cancelOrder, updateTracking, getOrderTracking } = require("../controllers/orderController");

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/all", auth, getAllOrders);
router.put("/cancel/:orderId", auth, cancelOrder);
router.put("/tracking/:orderId", auth, admin, updateTracking);
router.get("/tracking/:orderId", auth, getOrderTracking);

module.exports = router;