
import React, { useMemo, useState } from 'react';

// ProductCard component import karna
import ProductCard from './ProductCard';

// ==========================================
// PRODUCT LIST COMPONENT
// Purpose:
// 1. Saare products display karna.
// 2. Category filter karna.
// 3. Search karna.
// 4. Price aur rating ke according sorting.
// 5. ProductCard ke callbacks parent ko dena.
// ==========================================

function ProductList({
  products = [],
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  wishlist = []
}) {

  // ==========================================
  // FILTER AND SORT STATES
  // ==========================================

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // ==========================================
  // CATEGORY LIST
  // ==========================================

  const categories = ['All', 'Men', 'Women', 'Kids'];

  // ==========================================
  // FILTER AND SORT PRODUCTS
  // useMemo unnecessary recalculation ko avoid karta hai.
  // ==========================================

  const filteredProducts = useMemo(() => {

    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.title,
          product.brand,
          product.category,
          product.gender
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((product) => {
        const category = String(
          product.gender || product.category || ''
        ).toLowerCase();

        return category.includes(selectedCategory.toLowerCase());
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );
        break;

      case 'price-high':
        result.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );
        break;

      case 'rating':
        result.sort(
          (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
        );
        break;

      case 'discount':
        result.sort(
          (a, b) => Number(b.discount || 0) - Number(a.discount || 0)
        );
        break;

      case 'featured':
      default:
        break;
    }

    return result;

  }, [products, searchQuery, selectedCategory, sortBy]);

  // ==========================================
  // WISHLIST CHECK
  // Check karna ki product wishlist mein hai ya nahi.
  // ==========================================

  const isProductWishlisted = (product) => {
    return wishlist.some((item) => {
      return String(item.id) === String(product.id);
    });
  };

  // ==========================================
  // CLEAR FILTERS
  // Saare filters reset karna.
  // ==========================================

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  // ==========================================
  // MAIN PRODUCT LIST UI
  // ==========================================

  return (
    <section className="products-section" id="products">

      {/* Section heading */}
      <div className="section-heading">
        <div>
          <p className="section-subtitle">OUR COLLECTION</p>
          <h2>Explore Products</h2>
          <p className="product-count">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      {/* Search and sorting controls */}
      <div className="product-toolbar">

        {/* Search products */}
        <input
          type="search"
          className="product-search"
          placeholder="Search clothes, brands..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search products"
        />

        {/* Sort products */}
        <select
          className="product-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="discount">Highest Discount</option>
        </select>

        {/* Reset filters */}
        <button
          type="button"
          className="clear-filter-button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>

      {/* Category filter buttons */}
      <div className="product-filter-tabs">

        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category ? 'active' : ''
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}

      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (

        <div className="product-grid">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
              isWishlisted={isProductWishlisted(product)}
            />

          ))}

        </div>

      ) : (

        // No products found message
        <div className="no-products">
          <h3>No Products Found</h3>
          <p>Try another search or category.</p>

          <button
            type="button"
            onClick={clearFilters}
          >
            Show All Products
          </button>
        </div>

      )}

    </section>
  );
}

// ==========================================
// EXPORT COMPONENT
// ==========================================

export default ProductList;
