
import React, { useEffect, useMemo, useState } from 'react';
import DeliveryChecker from "./DeliveryChecker";
// Variant utility functions
import {
  getAvailableColors,
  getAvailableSizes,
  getSelectedVariant,
  getVariantPrice,
  getVariantImage,
  getVariantStock,
} from '../utils/variantUtils';

// ==========================================
// PRODUCT DETAILS COMPONENT
// Purpose:
// 1. Product ki complete details show karna.
// 2. Product image aur description display karna.
// 3. Available sizes select karna.
// 4. Available colors select karna.
// 5. Price, discount aur stock show karna.
// 6. Selected variant cart mein add karna.
// 7. Color change hone par image aur price update.
// 8. Variant ke according available sizes show.
// 9. Variant-specific stock aur SKU support.
// ==========================================

function ProductDetails({
  product,
  onClose,
  onAddToCart
}) {

  // ==========================================
  // COMPONENT STATES
  // Selected size aur color track karna.
  // ==========================================

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // ==========================================
  // PRODUCT VARIANTS
  // Product ke sizes aur colors read karna.
  // ==========================================

  // Variant data available ho to uske colors use honge.
  // Otherwise normal product colors use honge.
  const colors = useMemo(() => {
    if (!product) return [];

    return getAvailableColors(product);
  }, [product]);

  // Variant-based products mein available sizes
  // selected color ke according change honge.
  const sizes = useMemo(() => {
    if (!product) return [];

    if (product.variants?.length) {
      return getAvailableSizes(product, selectedColor);
    }

    return product.sizes?.length
      ? product.sizes
      : ['S', 'M', 'L', 'XL', 'XXL'];
  }, [product, selectedColor]);

  // ==========================================
  // RESET SELECTION WHEN PRODUCT CHANGES
  // Naya product open hone par default variant select.
  // ==========================================

  useEffect(() => {
    if (!product) return;

    const firstColor = colors[0] || '';

    setSelectedColor(firstColor);

    // Selected color ke available sizes find karna.
    const availableSizes = product.variants?.length
      ? getAvailableSizes(product, firstColor)
      : product.sizes?.length
        ? product.sizes
        : ['S', 'M', 'L', 'XL', 'XXL'];

    setSelectedSize(
      availableSizes[0] || 'M'
    );

  }, [product, colors]);

  // ==========================================
  // SELECTED VARIANT
  // Selected color aur size ka exact variant.
  // ==========================================

  const selectedVariant = product
    ? getSelectedVariant(
        product,
        selectedColor,
        selectedSize
      )
    : null;

  // ==========================================
  // PRODUCT DATA
  // Safe defaults ke saath product information.
  // ==========================================

  if (!product) return null;

  const productName =
    product.name ||
    product.title ||
    'Fashion Product';

  // Selected variant ki price use karna.
  // Normal product mein original price fallback rahega.
  const currentPrice = Number(
    product.variants?.length
      ? getVariantPrice(product, selectedColor, selectedSize)
      : product.price || 0
  );

  const originalPrice = Number(
    selectedVariant?.originalPrice ??
    product.originalPrice ??
    product.oldPrice ??
    currentPrice
  );

  const discount =
    selectedVariant?.discount ||
    (
      originalPrice > currentPrice && originalPrice > 0
        ? Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100
          )
        : 0
    );

  const rating = Number(product.rating || 0);

  // Selected color aur size ke according image.
  const productImage =
    (
      product.variants?.length
        ? getVariantImage(product, selectedColor, selectedSize)
        : product.image
    ) ||
    'https://placehold.co/500x600?text=Fashion+Product';

  // ==========================================
  // STOCK CHECK
  // Product available hai ya nahi check karna.
  // ==========================================

  // Variant-based products ka stock alag check hoga.
  // Normal products ka existing stock behavior preserve hai.
  const currentStock = product.variants?.length
    ? getVariantStock(product, selectedColor, selectedSize)
    : Number(product.stock ?? 0);

  const isOutOfStock = product.variants?.length
    ? !selectedVariant || Number(selectedVariant.stock) <= 0
    : (
        product.stock !== undefined &&
        Number(product.stock) <= 0
      );

  // ==========================================
  // COLOR CHANGE HANDLER
  // Color change hone par available sizes update.
  // ==========================================

  const handleColorChange = (color) => {
    setSelectedColor(color);

    const availableSizes = product.variants?.length
      ? getAvailableSizes(product, color)
      : product.sizes?.length
        ? product.sizes
        : ['S', 'M', 'L', 'XL', 'XXL'];

    // New color ka first available size select.
    setSelectedSize(availableSizes[0] || '');
  };

  // ==========================================
  // SIZE CHANGE HANDLER
  // Customer ka selected size update.
  // ==========================================

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // ==========================================
  // ADD TO CART HANDLER
  // Selected size aur color parent ko bhejna.
  // ==========================================

  const handleAddToCart = () => {

    if (isOutOfStock || !selectedSize) return;

    // Selected variant ka exact data.
    const cartProduct = {
      ...product,
      name: productName,
      image: productImage,
      price: currentPrice,
      size: selectedSize,
      color: selectedColor,
      stock: currentStock,
      sku: selectedVariant?.sku || product.sku || ''
    };

    if (onAddToCart) {
      onAddToCart(
        cartProduct,
        selectedSize
      );
    }

    if (onClose) {
      onClose();
    }
  };

  // ==========================================
  // MAIN PRODUCT DETAILS MODAL
  // ==========================================

  return (

    // Background overlay
    <div
      className="details-overlay"
      onClick={onClose}
      role="presentation"
    >

      {/* Product details modal */}
      <div
        className="details-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
      >

        {/* Close button */}
        <button
          type="button"
          className="details-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        {/* ======================================
            PRODUCT IMAGE SECTION
        ====================================== */}

        <div className="details-image">

          <img
            src={productImage}
            alt={productName}
            onError={(event) => {
              event.currentTarget.src =
                'https://placehold.co/500x600?text=Fashion+Product';
            }}
          />

          {discount > 0 && (
            <span className="product-discount">
              {discount}% OFF
            </span>
          )}

        </div>

        {/* ======================================
            PRODUCT INFORMATION SECTION
        ====================================== */}

        <div className="details-content">

          {/* Brand */}
          <span className="product-brand">
            {product.brand || 'Fashion Shop'}
          </span>

          {/* Product name */}
          <h2>{productName}</h2>

          {/* Rating */}
          <div className="rating">
            ★ {rating.toFixed(1)} / 5
          </div>

          {/* Price and discount */}
          <div className="details-price">

            <strong>
              ₹{currentPrice.toLocaleString('en-IN')}
            </strong>

            {originalPrice > currentPrice && (
              <del>
                ₹{originalPrice.toLocaleString('en-IN')}
              </del>
            )}

            {discount > 0 && (
              <span>{discount}% OFF</span>
            )}

          </div>

          {/* Product description */}
          <p className="details-description">
            {selectedVariant?.description ||
              product.description ||
              `Discover everyday comfort and modern style with this fashionable collection from ${product.brand || 'Fashion Shop'}.`}
          </p>

          {/* ======================================
              SIZE SELECTION
          ====================================== */}

          <h4>Select Size</h4>

          <div className="size-options">

            {sizes.length > 0 ? (

              sizes.map((size) => (

                <button
                  type="button"
                  key={size}
                  className={
                    selectedSize === size ? 'selected-size' : ''
                  }
                  onClick={() => handleSizeChange(size)}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>

              ))

            ) : (

              <p>No sizes currently available.</p>

            )}

          </div>

          {/* ======================================
              COLOR SELECTION
              Available colors display karna.
          ====================================== */}

          {colors.length > 0 && (

            <>
              <h4>Select Color</h4>

              <div className="color-options">

                {colors.map((color) => (

                  <button
                    type="button"
                    key={color}
                    className={
                      selectedColor === color
                        ? 'selected-color'
                        : ''
                    }
                    onClick={() => handleColorChange(color)}
                    aria-pressed={selectedColor === color}
                  >
                    {color}
                  </button>

                ))}

              </div>
            </>

          )}

          {/* ======================================
              SELECTED VARIANT INFORMATION
              SKU aur selected combination show.
          ====================================== */}

          {selectedVariant?.sku && (

            <p className="product-sku">
              SKU: {selectedVariant.sku}
            </p>

          )}

          {/* Stock information */}
          <p className="product-stock">

            {isOutOfStock

              ? 'Currently Out of Stock'

              : product.variants?.length
                ? `✓ ${currentStock} items available`
                : '✓ Available for purchase'

            }

          </p>

          {/* ======================================
              ADD TO CART BUTTON
          ====================================== */}

          <button
            type="button"
            className="add-cart-button details-add-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !selectedSize}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Delivery information */}
          <p className="delivery-note">
            🚚 Free shipping on orders above ₹999
          </p>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// EXPORT COMPONENT
// ==========================================

export default ProductDetails;
