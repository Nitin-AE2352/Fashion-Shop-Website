
import React from 'react';

// ==========================================
// PRODUCT CARD COMPONENT
// Purpose: Website par ek product ki complete
// information aur shopping buttons show karna.
// ==========================================

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  isWishlisted = false
}) {

  // ==========================================
  // PRODUCT DATA
  // Product object se saari required details lena.
  // ==========================================

  const {
    id,
    name,
    title,
    image,
    price,
    originalPrice,
    rating,
    discount,
    brand,
    category,
    sizes,
    colors,
    stock
  } = product;

  // Product name available na ho to default name.
  const productName = name || title || 'Fashion Product';

  // Product image available na ho to placeholder.
  const productImage =
    image || 'https://placehold.co/400x500?text=Fashion+Product';

  // Price ko number mein convert karna.
  const currentPrice = Number(price || 0);
  const oldPrice = Number(originalPrice || 0);

  // Agar discount nahi diya gaya to calculate karna.
  const discountPercentage =
    discount ||
    (oldPrice > currentPrice && oldPrice > 0
      ? Math.round(
          ((oldPrice - currentPrice) / oldPrice) * 100
        )
      : 0);

  // Stock status check karna.
  const isOutOfStock =
    stock !== undefined && Number(stock) <= 0;

  // ==========================================
  // ADD TO CART HANDLER
  // Parent component ko selected product bhejna.
  // ==========================================

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // ==========================================
  // WISHLIST HANDLER
  // Product ko wishlist mein add/remove karna.
  // ==========================================

  const handleWishlist = (event) => {
    event.stopPropagation();

    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  // ==========================================
  // PRODUCT DETAILS HANDLER
  // Product par click karne se details open karna.
  // ==========================================

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  // ==========================================
  // MAIN PRODUCT CARD UI
  // ==========================================

  return (
    <article className="product-card" data-product-id={id}>

      {/* Product image section */}
      <div
        className="product-image-wrapper"
        onClick={handleViewDetails}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleViewDetails();
          }
        }}
      >

        <img
          src={productImage}
          alt={productName}
          className="product-image"
          loading="lazy"
        />

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <span className="product-discount">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <span className="product-stock-badge">
            Out of Stock
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          className={`wishlist-button ${
            isWishlisted ? 'active' : ''
          }`}
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
          aria-pressed={isWishlisted}
          onClick={handleWishlist}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>

      </div>

      {/* Product details section */}
      <div className="product-info">

        {/* Brand name */}
        {brand && (
          <p className="product-brand">
            {brand}
          </p>
        )}

        {/* Product name */}
        <h3
          className="product-name"
          onClick={handleViewDetails}
        >
          {productName}
        </h3>

        {/* Product category */}
        {category && (
          <p className="product-category">
            {category}
          </p>
        )}

        {/* Product pricing */}
        <div className="product-pricing">

          <strong>
            ₹{currentPrice.toLocaleString('en-IN')}
          </strong>

          {oldPrice > currentPrice && (
            <del>
              ₹{oldPrice.toLocaleString('en-IN')}
            </del>
          )}

        </div>

        {/* Product rating */}
        {rating !== undefined && rating !== null && (
          <div className="product-rating">
            <span>★</span>
            {rating}
          </div>
        )}

        {/* Available sizes */}
        {sizes && sizes.length > 0 && (
          <div className="product-sizes">
            <span>Sizes:</span> {sizes.join(', ')}
          </div>
        )}

        {/* Available colors */}
        {colors && colors.length > 0 && (
          <div className="product-colors">
            <span>Colors:</span> {colors.join(', ')}
          </div>
        )}

        {/* Add to cart button */}
        <button
          type="button"
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

      </div>
    </article>
  );
}

// ==========================================
// EXPORT COMPONENT
// App.jsx ya kisi doosri file mein use karne ke liye.
// ==========================================

export default ProductCard;
