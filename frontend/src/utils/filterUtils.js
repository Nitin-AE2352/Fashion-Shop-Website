
// ==========================================
// FASHION SHOP - FILTER UTILITIES
// Product filtering aur sorting ke reusable functions.
// ==========================================

// ==========================================
// 1. FILTER PRODUCTS
// Category, brand, size, color, price,
// fabric, fit, rating aur stock ke basis par.
// ==========================================

export const filterProducts = (products = [], filters = {}) => {

  return products.filter((product) => {

    // Category filter
    if (
      filters.category &&
      filters.category !== "All" &&
      product.category !== filters.category
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {

      const searchText = filters.search.toLowerCase();

      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.fabric,
        product.fit
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchText)) {
        return false;
      }
    }

    // Brand filter
    if (
      filters.brand?.length &&
      !filters.brand.includes(product.brand)
    ) {
      return false;
    }

    // Size filter
    if (filters.size?.length) {

      const productSizes = product.sizes || [];

      if (!filters.size.some((size) => productSizes.includes(size))) {
        return false;
      }
    }

    // Color filter
    if (filters.color?.length) {

      const productColors = product.colors || [];

      if (!filters.color.some((color) => productColors.includes(color))) {
        return false;
      }
    }

    // Fabric filter
    if (
      filters.fabric?.length &&
      !filters.fabric.includes(product.fabric)
    ) {
      return false;
    }

    // Fit filter
    if (
      filters.fit?.length &&
      !filters.fit.includes(product.fit)
    ) {
      return false;
    }

    // Minimum price
    if (
      filters.minPrice !== undefined &&
      filters.minPrice !== "" &&
      Number(product.price) < Number(filters.minPrice)
    ) {
      return false;
    }

    // Maximum price
    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== "" &&
      Number(product.price) > Number(filters.maxPrice)
    ) {
      return false;
    }

    // Minimum discount
    if (
      filters.minDiscount !== undefined &&
      Number(product.discount || 0) < Number(filters.minDiscount)
    ) {
      return false;
    }

    // Minimum rating
    if (
      filters.rating !== undefined &&
      filters.rating !== "" &&
      Number(product.rating || 0) < Number(filters.rating)
    ) {
      return false;
    }

    // In-stock filter
    if (
      filters.inStockOnly &&
      Number(product.stock || 0) <= 0
    ) {
      return false;
    }

    // New arrivals filter
    if (
      filters.newArrivals &&
      !product.isNew
    ) {
      return false;
    }

    return true;

  });

};


// ==========================================
// 2. SORT PRODUCTS
// Price, discount, rating aur newest sorting.
// ==========================================

export const sortProducts = (products = [], sortBy = "default") => {

  // Original array ko modify nahi karna.
  const sortedProducts = [...products];

  switch (sortBy) {

    // Price low to high
    case "price-low":
      return sortedProducts.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );

    // Price high to low
    case "price-high":
      return sortedProducts.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );

    // Highest discount first
    case "discount":
      return sortedProducts.sort(
        (a, b) => Number(b.discount || 0) - Number(a.discount || 0)
      );

    // Highest rating first
    case "rating":
      return sortedProducts.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );

    // New arrivals first
    case "newest":
      return sortedProducts.sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew))
      );

    // Default order
    default:
      return sortedProducts;

  }

};


// ==========================================
// 3. GET UNIQUE FILTER OPTIONS
// Brand, size, color, fabric aur fit options.
// ==========================================

export const getFilterOptions = (products = []) => {

  const getUniqueValues = (field) => {

    const values = products.flatMap((product) => {

      const value = product[field];

      return Array.isArray(value)
        ? value
        : value ? [value] : [];

    });

    return [...new Set(values)].sort();

  };

  return {

    brands: getUniqueValues("brand"),
    sizes: getUniqueValues("sizes"),
    colors: getUniqueValues("colors"),
    fabrics: getUniqueValues("fabric"),
    fits: getUniqueValues("fit")

  };

};


// ==========================================
// 4. GET PRODUCT DISCOUNT
// Original price aur selling price se discount.
// ==========================================

export const calculateDiscount = (product) => {

  const originalPrice = Number(
    product.originalPrice ?? product.oldPrice ?? 0
  );

  const currentPrice = Number(product.price || 0);

  if (originalPrice <= 0 || originalPrice <= currentPrice) {
    return 0;
  }

  return Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

};


// ==========================================
// 5. GET FINAL PRODUCTS
// Filtering + Sorting ek function se.
// ==========================================

export const getFilteredAndSortedProducts = (
  products = [],
  filters = {},
  sortBy = "default"
) => {

  const filteredProducts = filterProducts(products, filters);

  return sortProducts(filteredProducts, sortBy);

};
