
import React, { useEffect, useState } from 'react';

import ProductList from '../components/ProductList';

// ==========================================
// HOME PAGE
// Fashion Shop ka main landing page.
// ==========================================

const heroImages = [
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1000',
  'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=1000'
];

function Home({
  products = [],
  wishlist = [],
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  onCategoryChange
}) {

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 2000);
    return () => clearInterval(id);
  }, []);

  // Homepage categories
  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600' },
    { name: 'Kids', image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=600' },
    { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600' }
  ];

  // Category select handler
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (

    <main className="home-page">

      {/* ======================================
          HERO BANNER
      ====================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="hero-tagline">
            NEW SEASON COLLECTION
          </span>

          <h1>
            Discover Your
            <br />
            Own Style
          </h1>

          <p>
            Explore the latest fashion trends and
            find your perfect everyday style.
          </p>

          <button
            type="button"
            className="hero-shop-button"
            onClick={() => handleCategoryClick('All')}
          >
            Shop Now →
          </button>

        </div>

        <div className="home-hero-image">

          <img
            src={heroImages[heroIndex]}
            alt="Fashion collection"
          />

        </div>

      </section>

      {/* ======================================
          SHOPPING BENEFITS
      ====================================== */}

      <section className="home-benefits">

        <div className="benefit-item">
          <span>🚚</span>
          <div>
            <h3>Free Shipping</h3>
            <p>On eligible orders</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>↩️</span>
          <div>
            <h3>Easy Returns</h3>
            <p>Simple return process</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>🔒</span>
          <div>
            <h3>Secure Payments</h3>
            <p>Safe checkout experience</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>💬</span>
          <div>
            <h3>Customer Support</h3>
            <p>We're here to help</p>
          </div>
        </div>

      </section>

      {/* ======================================
          CATEGORY SECTION
      ====================================== */}

      <section className="home-categories">

        <div className="home-section-heading">

          <span>EXPLORE COLLECTIONS</span>

          <h2>Shop By Category</h2>

          <p>
            Find the perfect collection for every style.
          </p>

        </div>

        <div className="home-category-grid">

          {categories.map((category) => (

            <button
              type="button"
              className="home-category-card"
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
            >

              <img
                src={category.image}
                alt={`${category.name} collection`}
                loading="lazy"
              />

              <div className="category-card-overlay">

                <h3>{category.name}</h3>

                <span>Explore Collection →</span>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* ======================================
          FEATURED PRODUCTS
      ====================================== */}

      <ProductList
        products={products}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        onViewDetails={onViewDetails}
      />

      {/* ======================================
          PROMOTIONAL BANNER
      ====================================== */}

      <section className="home-promo">

        <div className="home-promo-content">

          <span>FASHION SALE</span>

          <h2>
            Upgrade Your
            <br />
            Everyday Style
          </h2>

          <p>
            Discover fresh styles and make every outfit special.
          </p>

          <button
            type="button"
            onClick={() => handleCategoryClick('All')}
          >
            Explore Now →
          </button>

        </div>

      </section>

    </main>

  );
}

// ==========================================
// EXPORT HOME PAGE
// ==========================================

export default Home;
