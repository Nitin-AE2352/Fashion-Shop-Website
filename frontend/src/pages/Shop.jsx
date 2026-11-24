
/*
=====================================================
FASHION SHOP - SHOP PAGE
File: frontend/src/pages/Shop.jsx

PURPOSE:
1. Display all products.
2. Connect ProductFilters with product data.
3. Apply filters using existing filterUtils.js.
4. Display filtered products using ProductList.
=====================================================
*/

import { useMemo, useState } from "react";
import "./Shop.css";
import ProductFilters from "../components/ProductFilters";
import ProductList from "../components/ProductList";

import {
  filterProducts,
  getFilteredAndSortedProducts,
} from "../utils/filterUtils";

import "../components/ProductFilters.css";

function Shop({
  products = [],
  wishlist = [],
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}) {
  // Stores filters selected by the customer.
  const [filters, setFilters] = useState({
    brands: [],
    sizes: [],
    colors: [],
    fabrics: [],
    fits: [],
    minPrice: null,
    maxPrice: null,
    rating: 0,
    inStockOnly: false,
    newArrivals: false,
  });

  // Stores the current sorting option.
  const [sortBy, setSortBy] = useState("newest");

  // Applies selected filters and sorting.
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, filters);

    return getFilteredAndSortedProducts(filtered, {}, sortBy);
  }, [products, filters, sortBy]);

  // Updates selected filters.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clears all filters.
  const clearFilters = () => {
    setFilters({
      brands: [],
      sizes: [],
      colors: [],
      fabrics: [],
      fits: [],
      minPrice: null,
      maxPrice: null,
      rating: 0,
      inStockOnly: false,
      newArrivals: false,
    });
  };

  return (
    <main className="shop-page">

      {/* Shop heading */}
      <header className="shop-page-header">
        <p className="shop-eyebrow">FASHION SHOP COLLECTION</p>

        <h1>Explore All Products</h1>

        <p>
          Discover the latest fashion collections for everyone.
        </p>
      </header>

      {/* Main shop layout */}
      <div className="shop-layout">

        {/* Sidebar filters */}
        <aside className="shop-filter-sidebar">
          <ProductFilters
            products={products}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Products section */}
        <section className="shop-products-area">

          <div className="shop-results-heading">
            <div>
              <h2>All Products</h2>

              <p>
                Showing {filteredProducts.length} products
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Clear filters */}
          <button
            type="button"
            className="shop-clear-filters"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>

          {/* Product list */}
          <ProductList
            products={filteredProducts}
            wishlist={wishlist}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            onViewDetails={onViewDetails}
          />

        </section>
      </div>

    </main>
  );
}

export default Shop;
