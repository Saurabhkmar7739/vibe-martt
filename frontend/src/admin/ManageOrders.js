import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Orders.css";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
    status: "",
    updateMessage: "",
    updateLocation: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
    } catch (err) {
      setMessage("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateTracking = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        trackingNumber: trackingForm.trackingNumber,
        carrier: trackingForm.carrier,
        estimatedDelivery: trackingForm.estimatedDelivery,
        status: trackingForm.status
      };

      if (trackingForm.updateMessage) {
        updateData.trackingUpdate = {
          status: trackingForm.status || selectedOrder.status,
          message: trackingForm.updateMessage,
          location: trackingForm.updateLocation
        };
      }

      await axios.put(
        `http://localhost:5000/api/orders/tracking/${selectedOrder.orderId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Tracking updated successfully");
      setTrackingForm({
        trackingNumber: "",
        carrier: "",
        estimatedDelivery: "",
        status: "",
        updateMessage: "",
        updateLocation: ""
      });
      fetchOrders();
    } catch (err) {
      setMessage("Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "#ff9800";
      case "Shipped": return "#2196f3";
      case "Out for Delivery": return "#9c27b0";
      case "Delivered": return "#4caf50";
      case "Cancelled": return "#f44336";
      default: return "#757575";
    }
  };

  return (
    <div className="orders-container">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>Update order status and tracking information</p>
      </div>

      {message && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: message.includes("success") ? "#e8f5e8" : "#ffebee",
          color: message.includes("success") ? "#2e7d32" : "#c62828",
          border: `1px solid ${message.includes("success") ? "#4caf50" : "#f44336"}`
        }}>
          {message}
        </div>
      )}

      <div className="orders-section">
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-info-label">Order ID</div>
                  <div className="order-info-value">{order.orderId}</div>
                </div>
                <div className="order-info">
                  <div className="order-info-label">Customer</div>
                  <div className="order-info-value">{order.userName}</div>
                </div>
                <div className="order-info">
                  <div className="order-info-label">Total</div>
                  <div className="order-info-value">₹{order.total}</div>
                </div>
                <div className="order-info">
                  <div className="order-info-label">Status</div>
                  <span
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {order.tracking?.trackingNumber && (
                <div style={{ padding: '12px 0', fontSize: 13, color: 'var(--muted)', borderTop: '1px solid var(--border)', marginTop: 12 }}>
                  <div><strong>Tracking:</strong> {order.tracking.trackingNumber} ({order.tracking.carrier})</div>
                  {order.tracking.estimatedDelivery && (
                    <div><strong>Est. Delivery:</strong> {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}</div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: 12 }}>
                <button
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                >
                  {selectedOrder?._id === order._id ? 'Cancel Update' : 'Update Tracking'}
                </button>
              </div>

              {selectedOrder?._id === order._id && (
                <div style={{
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 8
                }}>
                  <h4 style={{ marginBottom: 12 }}>Update Tracking Information</h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingForm.trackingNumber}
                        onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                        placeholder="Enter tracking number"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          fontSize: 14
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        Carrier
                      </label>
                      <select
                        value={trackingForm.carrier}
                        onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          fontSize: 14
                        }}
                      >
                        <option value="">Select carrier</option>
                        <option value="FedEx">FedEx</option>
                        <option value="UPS">UPS</option>
                        <option value="USPS">USPS</option>
                        <option value="DHL">DHL</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        Status
                      </label>
                      <select
                        value={trackingForm.status}
                        onChange={(e) => setTrackingForm({...trackingForm, status: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          fontSize: 14
                        }}
                      >
                        <option value="">Select status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        Est. Delivery Date
                      </label>
                      <input
                        type="date"
                        value={trackingForm.estimatedDelivery}
                        onChange={(e) => setTrackingForm({...trackingForm, estimatedDelivery: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          fontSize: 14
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Status Update Message (Optional)
                    </label>
                    <input
                      type="text"
                      value={trackingForm.updateMessage}
                      onChange={(e) => setTrackingForm({...trackingForm, updateMessage: e.target.value})}
                      placeholder="e.g., Package picked up by carrier"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        fontSize: 14
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={trackingForm.updateLocation}
                      onChange={(e) => setTrackingForm({...trackingForm, updateLocation: e.target.value})}
                      placeholder="e.g., New York, NY"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        fontSize: 14
                      }}
                    />
                  </div>

                  <button
                    onClick={updateTracking}
                    disabled={loading}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 6,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Tracking'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}