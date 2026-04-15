const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  res.json(await Product.find());
};

exports.createProduct = async (req, res) => {
  res.json(await Product.create(req.body));
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};