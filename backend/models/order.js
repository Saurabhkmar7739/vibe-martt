const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  userEmail: String,
  userPhone: String,
  shipping: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  items: Array,
  subtotal: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  status: { type: String, default: "Confirmed" },
  tracking: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    trackingUpdates: [{
      status: String,
      message: String,
      location: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);