
/*
================================================
FASHION SHOP - PRODUCT VARIANT UTILITIES
File: frontend/src/utils/variantUtils.js

PURPOSE:
1. Get available colors.
2. Get sizes for selected color.
3. Find selected variant.
4. Check variant stock.
5. Calculate variant price.
================================================
*/

// Get all available colors of a product.
export function getAvailableColors(product) {
  if (product.variants?.length) {
    return [
      ...new Set(
        product.variants.map((variant) => variant.color)
      ),
    ];
  }

  return product.colors || [];
}

// Get available sizes for selected color.
export function getAvailableSizes(product, selectedColor) {
  if (!product.variants?.length) {
    return product.sizes || [];
  }

  return product.variants
    .filter(
      (variant) =>
        variant.color === selectedColor &&
        variant.stock > 0
    )
    .map((variant) => variant.size);
}

// Find exact color and size combination.
export function getSelectedVariant(
  product,
  selectedColor,
  selectedSize
) {
  if (!product.variants?.length) {
    return null;
  }

  return (
    product.variants.find(
      (variant) =>
        variant.color === selectedColor &&
        variant.size === selectedSize
    ) || null
  );
}

// Check whether selected variant is available.
export function isVariantAvailable(
  product,
  selectedColor,
  selectedSize
) {
  const variant = getSelectedVariant(
    product,
    selectedColor,
    selectedSize
  );

  if (product.variants?.length) {
    return Boolean(variant && variant.stock > 0);
  }

  return Number(product.stock || 0) > 0;
}

// Get selected variant price.
export function getVariantPrice(
  product,
  selectedColor,
  selectedSize
) {
  const variant = getSelectedVariant(
    product,
    selectedColor,
    selectedSize
  );

  return variant?.price ?? product.price ?? 0;
}

// Get selected variant image.
export function getVariantImage(
  product,
  selectedColor,
  selectedSize
) {
  const variant = getSelectedVariant(
    product,
    selectedColor,
    selectedSize
  );

  return (
    variant?.image ||
    product.image ||
    ""
  );
}

// Get selected variant stock.
export function getVariantStock(
  product,
  selectedColor,
  selectedSize
) {
  const variant = getSelectedVariant(
    product,
    selectedColor,
    selectedSize
  );

  if (product.variants?.length) {
    return variant?.stock ?? 0;
  }

  return Number(product.stock || 0);
}
