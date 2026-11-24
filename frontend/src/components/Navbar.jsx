
import React, { useState } from 'react';

// ==========================================
// NAVBAR COMPONENT
// Purpose:
// 1. Fashion Shop logo display karna.
// 2. Home, Men, Women, Kids navigation.
// 3. Product search functionality.
// 4. Wishlist count show karna.
// 5. Cart count show karna.
// 6. Mobile navigation menu.
// ==========================================

function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onOpenCart,
  onOpenWishlist,
  onCategoryChange,
  onLogoClick
}) {

  // ==========================================
  // COMPONENT STATES
  // Search input aur mobile menu control.
  // ==========================================

  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // ==========================================
  // NAVIGATION LINKS
  // Website ke main shopping categories.
  // ==========================================

  const navLinks = [
    { label: 'Home', value: 'Home' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' },
    { label: 'New Arrivals', value: 'New Arrivals' }
  ];

  // ==========================================
  // SEARCH HANDLER
  // Search query parent component ko bhejna.
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(searchQuery.trim());
    }

    setMenuOpen(false);
  };

  // ==========================================
  // CATEGORY HANDLER
  // Selected category parent ko bhejna.
  // ==========================================

  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }

    setMenuOpen(false);
  };

  // ==========================================
  // MAIN NAVBAR UI
  // ==========================================

  return (

    <header className="navbar">

      {/* ======================================
          LOGO SECTION
      ====================================== */}

      <div
        className="navbar-logo"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onLogoClick?.();
          }
        }}
      >
        <span className="logo-icon">F</span>
        <span>FASHION<span className="logo-highlight"> SHOP</span></span>
      </div>

      {/* ======================================
          MOBILE MENU BUTTON
      ====================================== */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen((previous) => !previous)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? '×' : '☰'}
      </button>

      {/* ======================================
          NAVIGATION LINKS
      ====================================== */}

      <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>

        {navLinks.map((link) => (

          <button
            type="button"
            key={link.value}
            onClick={() => handleCategoryClick(link.value)}
            className="navbar-link"
          >
            {link.label}
          </button>

        ))}

      </nav>

      {/* ======================================
          SEARCH BAR
      ====================================== */}

      <form
        className="navbar-search"
        onSubmit={handleSearch}
      >

        <input
          type="search"
          placeholder="Search for clothes..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search products"
        />

        <button
          type="submit"
          aria-label="Search"
        >
          🔍
        </button>

      </form>

      {/* ======================================
          NAVBAR ACTIONS
          Wishlist and cart buttons.
      ====================================== */}

      <div className="navbar-actions">

        {/* Wishlist */}
        <button
          type="button"
          className="navbar-icon-button"
          onClick={onOpenWishlist}
          aria-label="Open wishlist"
        >
          <span>♡</span>
          <small>Wishlist</small>

          {wishlistCount > 0 && (
            <span className="navbar-count">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Shopping cart */}
        <button
          type="button"
          className="navbar-icon-button cart-nav-button"
          onClick={onOpenCart}
          aria-label="Open shopping cart"
        >
          <span>🛒</span>
          <small>Cart</small>

          {cartCount > 0 && (
            <span className="navbar-count">
              {cartCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
}

// ==========================================
// EXPORT NAVBAR COMPONENT
// ==========================================

export default Navbar;
