import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import "../styles/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getProductImage = (productName) => {
    const imageMap = {
      "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    };
    return imageMap[productName] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          localStorage.setItem("vibeCartOrders", JSON.stringify(data));
        } else {
          throw new Error();
        }
      } catch {
        const saved = localStorage.getItem("vibeCartOrders");
        setOrders(saved ? JSON.parse(saved) : []);
      }
    };

    fetchOrders();
  }, []);

  const statusSteps = ["Confirmed", "Shipped", "Out for Delivery", "Delivered"];

  const getStatusStepIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
      case "Delivered":
        return <FiCheckCircle size={16} color="green" />;
      case "Shipped":
        return <FiTruck size={16} color="blue" />;
      case "Cancelled":
        return <FiClock size={16} color="red" />;
      default:
        return <FiClock size={16} />;
    }
  };

  // ✅ FIXED cancel logic
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status: "Cancelled" }
        : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("vibeCartOrders", JSON.stringify(updatedOrders));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      } catch {
        console.log("Backend failed");
      }
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <p>No orders yet</p>
        <Link to="/">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="order-card">

          {/* HEADER */}
          <div className="order-header">
            <div>Order ID: {order.id}</div>
            <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
            <div>Total: ₹{order.total}</div>
            <div>Status: {order.status}</div>
          </div>

          {/* TIMELINE */}
          <div className="order-timeline">
            {statusSteps.map((step, idx) => {
              const active = idx <= getStatusStepIndex(order.status);

              return (
                <div key={step} className={`timeline-step ${active ? "active" : ""}`}>
                  <div className="timeline-dot">
                    {active ? getStatusIcon(step) : ""}
                  </div>
                  <div>{step}</div>
                </div>
              );
            })}
          </div>

          {/* BUTTONS */}
          <div className="order-actions">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setExpandedOrder(
                  expandedOrder === order.id ? null : order.id
                )
              }
            >
              {expandedOrder === order.id ? "Hide Items" : "View Items"}
            </button>

            {order.status === "Confirmed" ? (
              <button
                className="btn btn-danger"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel Order
              </button>
            ) : order.status === "Cancelled" && (
              <span style={{ color: "red", fontWeight: 600 }}>
                Cancelled
              </span>
            )}
          </div>

          {/* ITEMS */}
          {expandedOrder === order.id && (
            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-card">
                  <img
                    src={item.image || getProductImage(item.name)}
                    alt={item.name}
                    width={60}
                  />
                  <div>{item.name}</div>
                  <div>Qty: {item.quantity || 1}</div>
                  <div>₹{item.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}