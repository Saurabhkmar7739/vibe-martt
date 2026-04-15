const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      orderId: req.body.orderId,
      user: req.user._id,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      shipping: req.body.shipping,
      items: req.body.items,
      subtotal: req.body.subtotal,
      discount: req.body.discount,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Confirmed",
      createdAt: new Date()
    };

    const order = await Order.create(orderData);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = {
      status: "Cancelled",
      $push: {
        'tracking.trackingUpdates': {
          status: "Cancelled",
          message: req.body?.message || "Order was cancelled",
          location: req.body?.location || "",
          timestamp: new Date()
        }
      }
    };

    const order = await Order.findOneAndUpdate(
      { orderId: orderId, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, carrier, estimatedDelivery, status, trackingUpdate } = req.body;

    const updateData = {};
    if (trackingNumber) updateData['tracking.trackingNumber'] = trackingNumber;
    if (carrier) updateData['tracking.carrier'] = carrier;
    if (estimatedDelivery) updateData['tracking.estimatedDelivery'] = new Date(estimatedDelivery);
    if (status) updateData.status = status;

    if (trackingUpdate) {
      updateData.$push = {
        'tracking.trackingUpdates': {
          status: trackingUpdate.status,
          message: trackingUpdate.message,
          location: trackingUpdate.location || '',
          timestamp: new Date()
        }
      };
    }

    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    res.json({
      success: true,
      tracking: order.tracking,
      status: order.status,
      createdAt: order.createdAt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};