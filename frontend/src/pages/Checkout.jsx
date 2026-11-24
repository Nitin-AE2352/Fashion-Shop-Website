
import React, { useMemo, useState } from "react";
import "./Checkout.css";

// Checkout page: customer details, order summary and payment selection.
function Checkout({ cart = [], onBack, onPlaceOrder }) {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [error, setError] = useState("");

  // Calculate subtotal from cart items.
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;

  const discount =
    appliedCoupon === "FASHION10" ? Math.min(subtotal * 0.1, 300) : 0;

  const total = Math.max(0, subtotal + shipping - discount);

  // Update address form fields.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: name === "phone" || name === "pincode"
        ? value.replace(/\D/g, "").slice(0, name === "phone" ? 10 : 6)
        : value,
    }));

    setError("");
  };

  // Apply demo coupon.
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "FASHION10" && subtotal > 0) {
      setAppliedCoupon(code);
      setError("");
    } else {
      setAppliedCoupon("");
      setError("Invalid coupon code. Try FASHION10.");
    }
  };

  // Validate customer details before continuing.
  const validateForm = () => {
    if (!address.fullName.trim()) return "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(address.phone))
      return "Please enter a valid 10-digit mobile number.";
    if (!/^[1-9]\d{5}$/.test(address.pincode))
      return "Please enter a valid 6-digit pincode.";
    if (!address.house.trim()) return "Please enter your house or building.";
    if (!address.area.trim()) return "Please enter your area or locality.";
    if (!address.city.trim()) return "Please enter your city.";
    if (!address.state.trim()) return "Please enter your state.";

    if (
      address.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)
    ) {
      return "Please enter a valid email address.";
    }

    if (cart.length === 0) return "Your cart is empty.";

    return "";
  };

  // Send checkout details to parent component.
  const handlePlaceOrder = () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const orderDetails = {
      address,
      paymentMethod,
      items: cart,
      subtotal,
      shipping,
      discount,
      total,
      coupon: appliedCoupon,
    };

    if (onPlaceOrder) {
      onPlaceOrder(orderDetails);
    } else {
      setError(
        "Checkout UI is ready. Connect the order API to place a real order."
      );
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-heading">
          <button className="checkout-back" onClick={onBack}>
            ← Continue Shopping
          </button>

          <h1>Secure Checkout</h1>
          <p>Complete your details to review your order.</p>
        </div>

        <div className="checkout-layout">
          {/* Customer delivery address */}
          <section className="checkout-main">
            <div className="checkout-card">
              <h2>1. Delivery Address</h2>

              <div className="checkout-form-grid">
                <label>
                  Full Name *
                  <input
                    name="fullName"
                    value={address.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </label>

                <label>
                  Mobile Number *
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                  />
                </label>

                <label>
                  Email Address
                  <input
                    name="email"
                    type="email"
                    value={address.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </label>

                <label>
                  Pincode *
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                  />
                </label>

                <label className="checkout-full-width">
                  House / Building / Street *
                  <input
                    name="house"
                    value={address.house}
                    onChange={handleChange}
                    placeholder="House number, building or street"
                  />
                </label>

                <label className="checkout-full-width">
                  Area / Locality *
                  <input
                    name="area"
                    value={address.area}
                    onChange={handleChange}
                    placeholder="Area or locality"
                  />
                </label>

                <label>
                  City *
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </label>

                <label>
                  State *
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </label>
              </div>
            </div>

            {/* Payment method selection */}
            <div className="checkout-card">
              <h2>2. Payment Method</h2>

              <div className="payment-options">
                <label className={paymentMethod === "cod" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives</small>
                  </span>
                </label>

                <label className={paymentMethod === "upi" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span>
                    <strong>UPI</strong>
                    <small>Google Pay, PhonePe, Paytm</small>
                  </span>
                </label>

                <label className={paymentMethod === "card" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  <span>
                    <strong>Credit / Debit Card</strong>
                    <small>Secure online payment</small>
                  </span>
                </label>
              </div>

              <p className="payment-note">
                Online payment will be enabled after payment gateway integration.
              </p>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
            >
              Place Order · ₹{total.toFixed(2)}
            </button>
          </section>

          {/* Order summary */}
          <aside className="checkout-summary">
            <div className="checkout-card">
              <h2>3. Order Summary</h2>

              {cart.length === 0 ? (
                <p className="checkout-empty">Your cart is empty.</p>
              ) : (
                <div className="checkout-items">
                  {cart.map((item, index) => (
                    <div
                      className="checkout-item"
                      key={`${item.id}-${item.size || ""}-${item.color || ""}-${index}`}
                    >
                      <div className="checkout-item-image">
                        <img
                          src={item.image}
                          alt={item.name || item.title || "Product"}
                        />
                      </div>

                      <div className="checkout-item-details">
                        <strong>{item.name || item.title}</strong>
                        <small>Size: {item.size || "Standard"}</small>
                        {item.color && <small>Color: {item.color}</small>}
                        <small>Qty: {item.quantity || 1}</small>
                        <strong>
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon */}
              <div className="checkout-coupon">
                <h3>Have a Coupon?</h3>

                <div className="coupon-input-row">
                  <input
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>

                {appliedCoupon && (
                  <p className="coupon-success">
                    {appliedCoupon} applied successfully!
                  </p>
                )}

                <small>Demo coupon: FASHION10</small>
              </div>

              {/* Price breakdown */}
              <div className="checkout-price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout-price-row">
                <span>Delivery</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              {discount > 0 && (
                <div className="checkout-price-row discount-row">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="checkout-total-row">
                <strong>Total Amount</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <p className="checkout-security">
                🔒 Your order details are protected.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
