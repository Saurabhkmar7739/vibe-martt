const router = require("express").Router();
const { getProducts, createProduct, deleteProduct } = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

module.exports = router;