const User = require("../models/user");
const Order = require("../models/order");

exports.getUsers = async (req, res) => {
  res.json(await User.find());
};

exports.getOrders = async (req, res) => {
  res.json(await Order.find().populate("user"));
};