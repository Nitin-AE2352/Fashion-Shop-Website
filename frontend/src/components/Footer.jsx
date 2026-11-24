
import React, { useState } from 'react';

// ==========================================
// FOOTER COMPONENT
// Purpose:
// 1. Company information display karna.
// 2. Shopping categories ke links dena.
// 3. Customer support information.
// 4. Social media links.
// 5. Newsletter subscription.
// 6. Copyright information.
// ==========================================

function Footer({ onSubscribe }) {

  // ==========================================
  // NEWSLETTER STATE
  // Customer ka email input store karna.
  // ==========================================

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // ==========================================
  // NEWSLETTER SUBMIT HANDLER
  // Email ko parent component/API ko bhejna.
  // ==========================================

  const handleSubscribe = (event) => {
    event.preventDefault();

    // Empty email validation
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Parent component ko email bhejna
    if (onSubscribe) {
      onSubscribe(email.trim());
    }

    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  // ==========================================
  // FOOTER LINKS DATA
  // Footer ke different sections ke links.
  // ==========================================

  const shoppingLinks = [
    'Men',
    'Women',
    'Kids',
    'New Arrivals',
    'Best Sellers',
    'Offers'
  ];

  const customerLinks = [
    'Contact Us',
    'FAQs',
    'Shipping Information',
    'Returns & Refunds',
    'Track Order',
    'Size Guide'
  ];

  const companyLinks = [
    'About Us',
    'Privacy Policy',
    'Terms & Conditions',
    'Careers'
  ];

  // ==========================================
  // MAIN FOOTER UI
  // ==========================================

  return (

    <footer className="main-footer">

      {/* ======================================
          NEWSLETTER SECTION
      ====================================== */}

      <div className="footer-newsletter">

        <div className="newsletter-content">

          <h2>Stay in Style</h2>

          <p>
            Subscribe to receive updates about new collections,
            exclusive offers and latest fashion trends.
          </p>

        </div>

        {/* Newsletter form */}
        <form
          className="footer-newsletter-form"
          onSubmit={handleSubscribe}
        >

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="Email address"
            required
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

        {/* Subscription message */}
        {message && (
          <p className="newsletter-message">
            {message}
          </p>
        )}

      </div>

      {/* ======================================
          FOOTER MAIN CONTENT
      ====================================== */}

      <div className="footer-content">

        {/* Company information */}
        <div className="footer-column footer-about">

          <h2>
            FASHION <span>SHOP</span>
          </h2>

          <p>
            Discover your style with Fashion Shop.
            Explore modern clothing collections for men,
            women and kids at great prices.
          </p>

          <div className="footer-social-links">

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              Instagram
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              YouTube
            </a>

          </div>

        </div>

        {/* Shopping links */}
        <div className="footer-column">

          <h3>Shop</h3>

          <ul>
            {shoppingLinks.map((link) => (
              <li key={link}>
                <a href="#products">{link}</a>
              </li>
            ))}
          </ul>

        </div>

        {/* Customer support links */}
        <div className="footer-column">

          <h3>Customer Support</h3>

          <ul>
            {customerLinks.map((link) => (
              <li key={link}>
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>

        </div>

        {/* Company links */}
        <div className="footer-column">

          <h3>Company</h3>

          <ul>
            {companyLinks.map((link) => (
              <li key={link}>
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>

        </div>

      </div>

      {/* ======================================
          PAYMENT AND DELIVERY INFORMATION
      ====================================== */}

      <div className="footer-services">

        <div>
          <span>🚚</span>
          <p>Free Shipping</p>
        </div>

        <div>
          <span>🔒</span>
          <p>Secure Payments</p>
        </div>

        <div>
          <span>↩️</span>
          <p>Easy Returns</p>
        </div>

        <div>
          <span>💬</span>
          <p>Customer Support</p>
        </div>

      </div>

      {/* ======================================
          COPYRIGHT SECTION
      ====================================== */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Fashion Shop.
          All Rights Reserved.
        </p>

        <p>
          Made with ♥ for Fashion Lovers
        </p>

      </div>

    </footer>
  );
}

// ==========================================
// EXPORT FOOTER COMPONENT
// ==========================================

export default Footer;
