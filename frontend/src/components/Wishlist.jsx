
import React from 'react';

// ==========================================
// WISHLIST COMPONENT
// Purpose:
// 1. Favourite products display karna.
// 2. Wishlist se product remove karna.
// 3. Wishlist product ko cart mein add karna.
// 4. Empty wishlist message show karna.
// 5. Product price aur discount display karna.
// ==========================================

function Wishlist({
  wishlist = [],
  onRemoveFromWishlist,
  onAddToCart,
  onClose,
  onViewDetails
}) {

  // ==========================================
  // REMOVE PRODUCT HANDLER
  // Selected product ko wishlist se remove karna.
  // ==========================================

  const handleRemove = (product) => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(product);
    }
  };

  // ==========================================
  // ADD TO CART HANDLER
  // Wishlist product ko cart mein bhejna.
  // ==========================================

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // ==========================================
  // MAIN WISHLIST UI
  // ==========================================

  return (

    <div
      className="wishlist-overlay"
      onClick={onClose}
      role="presentation"
    >

      {/* Wishlist drawer */}
      <aside
        className="wishlist-drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="My wishlist"
      >

        {/* ======================================
            WISHLIST HEADER
        ====================================== */}

        <div className="wishlist-header">

          <div>
            <h2>My Wishlist ♡</h2>
            <p>{wishlist.length} saved products</p>
          </div>

          <button
            type="button"
            className="wishlist-close"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            ×
          </button>

        </div>

        {/* ======================================
            WISHLIST PRODUCTS
        ====================================== */}

        <div className="wishlist-items">

          {wishlist.length === 0 ? (

            // Empty wishlist message
            <div className="wishlist-empty">

              <span>♡</span>

              <h3>Your wishlist is empty</h3>

              <p>
                Save your favourite styles here and shop them later.
              </p>

              <button
                type="button"
                onClick={onClose}
              >
                Explore Products
              </button>

            </div>

          ) : (

            // Display saved products
            wishlist.map((product) => {

              const price = Number(product.price || 0);

              const originalPrice = Number(
                product.originalPrice ??
                product.oldPrice ??
                0
              );

              const discount =
                product.discount ||
                (
                  originalPrice > price && originalPrice > 0
                    ? Math.round(
                        ((originalPrice - price) / originalPrice) * 100
                      )
                    : 0
                );

              return (

                <div
                  className="wishlist-item"
                  key={product.id}
                >

                  {/* Product image */}
                  <img
                    src={
                      product.image ||
                      'https://placehold.co/150x180?text=Product'
                    }
                    alt={product.name || product.title || 'Fashion product'}
                    onClick={() => onViewDetails?.(product)}
                  />

                  {/* Product details */}
                  <div className="wishlist-item-info">

                    <h4>
                      {product.name || product.title || 'Fashion Product'}
                    </h4>

                    {product.brand && (
                      <p className="product-brand">
                        {product.brand}
                      </p>
                    )}

                    {/* Product price */}
                    <div className="wishlist-price">

                      <strong>
                        ₹{price.toLocaleString('en-IN')}
                      </strong>

                      {originalPrice > price && (
                        <del>
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </del>
                      )}

                    </div>

                    {/* Discount */}
                    {discount > 0 && (
                      <span className="wishlist-discount">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Product rating */}
                    {product.rating !== undefined && (
                      <p className="wishlist-rating">
                        ★ {product.rating} / 5
                      </p>
                    )}

                    {/* Add to cart */}
                    <button
                      type="button"
                      className="wishlist-add-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      type="button"
                      className="wishlist-remove-button"
                      onClick={() => handleRemove(product)}
                    >
                      Remove ♡
                    </button>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </aside>

    </div>
  );
}

// ==========================================
// EXPORT WISHLIST COMPONENT
// ==========================================

export default Wishlist;
