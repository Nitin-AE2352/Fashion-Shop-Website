
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  // Browser localStorage se saved orders load karein
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("fashionShopOrders") || "[]"
      );

      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch (error) {
      console.error("Unable to load orders:", error);
      setOrders([]);
    }
  }, []);

  // Order date ko readable format mein convert karein
  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Status ke according CSS class
  const getStatusClass = (status) => {
    const value = String(status || "Confirmed").toLowerCase();

    if (value.includes("deliver")) return "delivered";
    if (value.includes("cancel")) return "cancelled";
    if (value.includes("ship")) return "shipped";
    if (value.includes("process")) return "processing";

    return "confirmed";
  };

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-heading">
          <div>
            <h1>My Orders</h1>
            <p>View and manage your recent purchases.</p>
          </div>

          <Link to="/shop" className="orders-shop-button">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <section className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>
              You haven't placed any orders. Explore our collection
              and find something you love.
            </p>

            <Link to="/shop" className="orders-shop-button">
              Start Shopping
            </Link>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => {
              const items = order.items || order.cart || [];
              const orderNumber =
                order.orderNumber ||
                order.id ||
                `FS${index + 1}`;

              const total =
                order.total ||
                order.grandTotal ||
                0;

              const status = order.status || "Confirmed";

              return (
                <article
                  className="order-card"
                  key={orderNumber}
                >
                  <div className="order-card-header">
                    <div>
                      <span>Order Number</span>
                      <strong>{orderNumber}</strong>
                    </div>

                    <div>
                      <span>Order Date</span>
                      <strong>
                        {formatDate(order.createdAt || order.date)}
                      </strong>
                    </div>

                    <div>
                      <span>Total Amount</span>
                      <strong>
                        ₹{Number(total).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <span
                      className={`order-badge ${getStatusClass(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="order-card-products">
                    {items.map((item, itemIndex) => (
                      <div
                        className="order-product"
                        key={`${item.id || itemIndex}-${item.size || ""}`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                          />
                        ) : (
                          <div className="order-product-placeholder">
                            👕
                          </div>
                        )}

                        <div className="order-product-info">
                          <h3>{item.name || item.title || "Product"}</h3>

                          <p>
                            Size: {item.size || "N/A"} | Quantity:{" "}
                            {item.quantity || 1}
                          </p>

                          <strong>
                            ₹
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span>
                      Payment:{" "}
                      {order.paymentMethod ||
                        order.payment ||
                        "Cash on Delivery"}
                    </span>

                    <Link
                      to="/order-confirmation"
                      state={{ order }}
                      className="order-details-link"
                    >
                      View Order Details →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
