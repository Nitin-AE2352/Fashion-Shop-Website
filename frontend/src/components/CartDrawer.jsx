
import React from 'react';

// ==========================================
// CART DRAWER COMPONENT
// Purpose:
// 1. Cart ke products display karna.
// 2. Product image, name, size aur color show karna.
// 3. Product quantity increase/decrease karna.
// 4. Variant-specific stock validate karna.
// 5. Product remove karna.
// 6. Cart subtotal aur total calculate karna.
// 7. Checkout callback parent component ko bhejna.
// ==========================================

function CartDrawer({
  cart = [],
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) {

  // ==========================================
  // CART CALCULATIONS
  // Total quantity aur total price calculate.
  // ==========================================

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // ==========================================
  // QUANTITY HANDLER
  // Selected variant ki quantity update.
  // ==========================================

  const handleQuantityChange = (item, change) => {

    const currentQuantity = Number(item.quantity || 1);
    const newQuantity = currentQuantity + change;

    // Quantity zero hone par item remove.
    if (newQuantity <= 0) {
      onRemove?.(item.id, item.size, item.color);
      return;
    }

    // Stock limit check.
    if (
      item.stock !== undefined &&
      newQuantity > Number(item.stock)
    ) {
      return;
    }

    // Existing arguments preserve kiye hain.
    // Color fourth argument mein bheja hai.
    onUpdateQuantity?.(
      item.id,
      item.size,
      change,
      item.color
    );
  };

  // ==========================================
  // REMOVE HANDLER
  // Exact color-size combination remove.
  // ==========================================

  const handleRemove = (item) => {
    onRemove?.(item.id, item.size, item.color);
  };

  // ==========================================
  // CHECKOUT HANDLER
  // Parent component ko cart aur total bhejna.
  // ==========================================

  const handleCheckout = () => {
    if (cart.length === 0) return;

    onCheckout?.(cart, total);
  };

  // ==========================================
  // MAIN CART DRAWER
  // ==========================================

  return (

    <div
      className="cart-overlay"
      onClick={onClose}
      role="presentation"
    >

      {/* Cart drawer */}
      <div
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >

        {/* ======================================
            CART HEADER
        ====================================== */}

        <div className="cart-header">

          <div>
            <h2>Shopping Cart</h2>

            <span>
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>

        </div>

        {/* ======================================
            CART ITEMS
        ====================================== */}

        <div className="cart-items">

          {cart.length === 0 ? (

            <div className="cart-empty">
              <h3>Your Cart is Empty</h3>

              <p>
                Explore our collection and add your favourite products.
              </p>

              <button
                type="button"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>

          ) : (

            cart.map((item) => {

              // Unique identity for each variant.
              const variantKey = [
                item.id,
                item.size || '',
                item.color || ''
              ].join('-');

              const quantity = Number(item.quantity || 1);

              const stockAvailable =
                item.stock === undefined ||
                quantity < Number(item.stock);

              const subtotal =
                Number(item.price || 0) * quantity;

              return (

                <div
                  className="cart-item"
                  key={variantKey}
                >

                  {/* Product image */}
                  <img
                    src={
                      item.image ||
                      'https://placehold.co/120x150?text=Product'
                    }
                    alt={item.name || item.title || 'Product'}
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://placehold.co/120x150?text=Product';
                    }}
                  />

                  {/* Product information */}
                  <div className="cart-item-info">

                    <h4>
                      {item.name || item.title || 'Fashion Product'}
                    </h4>

                    <p className="cart-item-price">
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </p>

                    {/* Selected size */}
                    {item.size && (
                      <p>
                        Size: {item.size}
                      </p>
                    )}

                    {/* Selected color */}
                    {item.color && (
                      <p>
                        Color: {item.color}
                      </p>
                    )}

                    {/* SKU */}
                    {item.sku && (
                      <p className="cart-item-sku">
                        SKU: {item.sku}
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item, -1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item, 1)
                        }
                        disabled={!stockAvailable}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                    </div>

                    {/* Stock warning */}
                    {!stockAvailable && (
                      <p className="cart-stock-warning">
                        Maximum available stock reached.
                      </p>
                    )}

                    {/* Remove product */}
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>

                    {/* Product subtotal */}
                    <p className="cart-item-subtotal">
                      Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                    </p>

                  </div>

                </div>

              );
            })

          )}

        </div>

        {/* ======================================
            CART FOOTER
        ====================================== */}

        {cart.length > 0 && (

          <div className="cart-footer">

            <div className="cart-total">
              <span>Total Amount</span>

              <strong>
                ₹{total.toLocaleString('en-IN')}
              </strong>
            </div>

            <p className="cart-shipping-note">
              Shipping charges will be calculated at checkout.
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

// ==========================================
// EXPORT COMPONENT
// ==========================================

export default CartDrawer;
