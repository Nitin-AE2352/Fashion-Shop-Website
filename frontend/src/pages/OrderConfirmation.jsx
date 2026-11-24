
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Checkout page se aayi order details
  const order = location.state?.order;

  // Direct page open hone par user ko home par bhejein
  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order details not found</h2>
        <p>Please place an order first.</p>
        <button onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  const orderNumber =
    order.orderNumber || `FS${Date.now().toString().slice(-8)}`;

  const items = order.items || order.cart || [];
  const total = order.total || order.grandTotal || 0;

  return (
    <main className="order-confirmation">
      <section className="confirmation-card">
        <div className="success-icon">✓</div>

        <h1>Thank You for Your Order!</h1>
        <p className="success-message">
          Your order has been placed successfully.
        </p>

        <div className="order-number">
          <span>Order Number</span>
          <strong>{orderNumber}</strong>
        </div>

        <div className="confirmation-details">
          <div>
            <span>Payment Method</span>
            <strong>{order.paymentMethod || order.payment || "Cash on Delivery"}</strong>
          </div>

          <div>
            <span>Order Total</span>
            <strong>
              ₹{Number(total).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Order Status</span>
            <strong className="order-status">Confirmed</strong>
          </div>
        </div>

        {order.address && (
          <div className="delivery-address">
            <h3>Delivery Address</h3>
            <p>
              {typeof order.address === "string"
                ? order.address
                : [
                    order.address.name,
                    order.address.address,
                    order.address.city,
                    order.address.state,
                    order.address.pincode,
                    order.address.phone,
                  ]
                    .filter(Boolean)
                    .join(", ")}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="confirmed-items">
            <h3>Ordered Products</h3>

            {items.map((item, index) => (
              <div
                className="confirmed-item"
                key={`${item.id || item.productId || index}-${item.size || ""}`}
              >
                <div>
                  <strong>{item.name || item.title || "Product"}</strong>
                  <span>
                    Size: {item.size || "N/A"} | Quantity:{" "}
                    {item.quantity || 1}
                  </span>
                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>

          <Link to="/my-orders" className="view-orders">
            View My Orders
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;
