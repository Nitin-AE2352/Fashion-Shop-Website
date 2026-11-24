
/*
=========================================================
FASHION SHOP - COMPLETE MAIN APPLICATION
File: frontend/src/App.jsx

FEATURES:
1. Homepage and Navigation
2. Product Categories
3. Product Search and Sorting
4. Product Details Modal
5. Wishlist
6. Shopping Cart
7. Quantity Management
8. Login and Signup Demo
9. User Profile
10. Checkout
11. Coupon System
12. Order Confirmation
13. My Orders
14. Order Details
15. LocalStorage Persistence

NOTE:
This is a frontend demo. Real authentication, payment,
database and courier tracking require backend APIs.
=========================================================
*/

import { useEffect, useMemo, useState } from "react";
import SupportChat from "./components/SupportChat";
import {
  getProducts,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "./api";
// =======================================================
// 1. PRODUCT DATA
// =======================================================

const demoProducts = [
  {
    id: 1,
    name: "Classic Oversized T-Shirt",
    brand: "Urban Style",
    category: "Men",
    price: 599,
    oldPrice: 999,
    rating: 4.5,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
    description: "Comfortable oversized cotton t-shirt for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Women's Casual Top",
    brand: "Style Hub",
    category: "Women",
    price: 799,
    oldPrice: 1299,
    rating: 4.4,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=700",
    description: "A stylish casual top for everyday fashion.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Premium Denim Jacket",
    brand: "Denim Co.",
    category: "Men",
    price: 1499,
    oldPrice: 2499,
    rating: 4.7,
    tag: "HOT DEAL",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700",
    description: "Premium denim jacket with a modern casual look.",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Elegant Summer Dress",
    brand: "Fashion House",
    category: "Women",
    price: 1199,
    oldPrice: 1899,
    rating: 4.6,
    tag: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700",
    description: "Elegant summer dress for a beautiful everyday look.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Casual Sneakers",
    brand: "Street Walk",
    category: "Men",
    price: 1799,
    oldPrice: 2999,
    rating: 4.3,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    description: "Comfortable sneakers for casual daily use.",
    sizes: ["7", "8", "9", "10", "11"],
  },
  {
    id: 6,
    name: "Women's Handbag",
    brand: "Luxe Carry",
    category: "Women",
    price: 999,
    oldPrice: 1599,
    rating: 4.5,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    description: "A fashionable handbag for everyday essentials.",
    sizes: ["FREE SIZE"],
  },
  {
    id: 7,
    name: "Kids Casual Outfit",
    brand: "Little Stars",
    category: "Kids",
    price: 699,
    oldPrice: 1099,
    rating: 4.2,
    tag: "VALUE DEAL",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700",
    description: "Comfortable casual outfit for kids.",
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
  },
  {
    id: 8,
    name: "Women's White Sneakers",
    brand: "Street Walk",
    category: "Women",
    price: 1599,
    oldPrice: 2299,
    rating: 4.6,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700",
    description: "Stylish white footwear for everyday outfits.",
    sizes: ["5", "6", "7", "8", "9"],
  },
];

const categories = [
  { name: "All", icon: "✦" },
  { name: "Men", icon: "👔" },
  { name: "Women", icon: "👗" },
  { name: "Kids", icon: "🧸" },
  { name: "Footwear", icon: "👟" },
  { name: "Accessories", icon: "👜" },
];

// =======================================================
// 2. LOCAL STORAGE HELPER
// =======================================================

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// =======================================================
// 3. EXTRA PAGE STYLES
// =======================================================

const pageStyles = `
.extra-page {
  min-height: 75vh;
  padding: 45px 7%;
  background: #faf8f6;
  color: #25212b;
}
.extra-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}
.extra-header h2 {
  margin: 0;
}
.extra-card {
  max-width: 680px;
  margin: 25px auto;
  padding: 30px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,.06);
}
.extra-card h2, .extra-card h3 {
  margin-top: 0;
}
.extra-field {
  display: block;
  width: 100%;
  padding: 13px;
  margin: 8px 0 16px;
  border: 1px solid #ddd;
  border-radius: 7px;
  box-sizing: border-box;
  font: inherit;
  background: #fff;
}
.extra-button {
  padding: 13px 22px;
  border: none;
  border-radius: 7px;
  background: #33213f;
  color: #fff;
  cursor: pointer;
  margin: 5px;
  font: inherit;
}
.extra-button:hover {
  opacity: .88;
}
.extra-muted {
  color: #777;
  font-size: 14px;
}
.extra-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(210px,1fr));
  gap: 20px;
}
.extra-product-card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,.05);
}
.extra-product-card img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 8px;
}
.extra-order-card {
  max-width: 850px;
  margin: 15px auto;
  padding: 22px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,.05);
}
.extra-summary-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin: 12px 0;
}
.extra-divider {
  border: 0;
  border-top: 1px solid #eee;
  margin: 18px 0;
}
.extra-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  background: #eee8f5;
  color: #33213f;
  font-size: 13px;
}
@media(max-width:600px) {
  .extra-page { padding: 25px 4%; }
  .extra-card { padding: 20px; }
}
`;

// =======================================================
// 4. MAIN APP COMPONENT
// =======================================================

function App() {
  // -------------------------------------------------------
  // 4.1 MAIN STATES
  // -------------------------------------------------------
  const [products, setProducts] = useState(demoProducts);
const [productsLoading, setProductsLoading] = useState(true);
const [productsError, setProductsError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const [cart, setCart] = useState(() =>
    readStorage("fashionShopCart", [])
  );

  const [wishlist, setWishlist] = useState(() =>
    readStorage("fashionShopWishlist", [])
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState("");

  // Extra pages
  const [activePage, setActivePage] = useState("home");

  const [user, setUser] = useState(() =>
    readStorage("fashionShopUser", null)
  );

  const [orders, setOrders] = useState(() =>
    readStorage("fashionShopOrders", [])
  );

  const [trackingOrder, setTrackingOrder] = useState(null);

  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
    coupon: "",
  });

  const [couponDiscount, setCouponDiscount] = useState(0);


  // -------------------------------------------------------
  // 4.2 LOAD PRODUCTS FROM SUPABASE
  // -------------------------------------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await getProducts();

        const productData = Array.isArray(response)
          ? response
          : response.products || response.items || [];

        const formattedProducts = productData.map((product) => {
          let sizes = product.sizes || [];

          if (typeof sizes === "string") {
            try {
              sizes = JSON.parse(sizes);
            } catch {
              sizes = [];
            }
          }

          return {
            id: product.id,
            name: product.name,
            brand: product.brand || "Fashion Shop",
            category: product.category || "Other",
            price: Number(product.price || 0),
            oldPrice: Number(
              product.original_price || product.oldPrice || product.price || 0
            ),
            rating: Number(product.rating || 0),
            tag: product.tag || "NEW ARRIVAL",
            image: product.image || "",
            description: product.description || "",
            sizes: Array.isArray(sizes) ? sizes : [],
            stock: Number(product.stock || 0),
          };
        });

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Products API Error:", error);
        setProducts(demoProducts);
        if (!productsError) {
          setProductsError("");
        }
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // -------------------------------------------------------
  // 4.2 SAVE DATA IN LOCAL STORAGE
  // -------------------------------------------------------

  useEffect(() => {
    localStorage.setItem("fashionShopCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("fashionShopWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("fashionShopUser", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("fashionShopOrders", JSON.stringify(orders));
  }, [orders]);

  // -------------------------------------------------------
  // 4.3 PRODUCT FILTERING AND SORTING
  // -------------------------------------------------------

  // -------------------------------------------------------
  // 4.3 TF-IDF COSINE SIMILARITY SEARCH
  // Ranks products by relevance so partial / short queries
  // (1-4 words, half-typed, wrong case) still show related results.
  // -------------------------------------------------------

  const tokenize = (text) => {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  };

  const productDocs = useMemo(
    () =>
      products.map((product) => [
        ...tokenize(product.name),
        ...tokenize(product.brand),
        ...tokenize(product.category),
      ]),
    [products]
  );

  const idf = useMemo(() => {
    const docCount = productDocs.length;
    const df = {};
    productDocs.forEach((doc) => {
      const seen = new Set(doc);
      seen.forEach((term) => {
        df[term] = (df[term] || 0) + 1;
      });
    });
    const result = {};
    Object.keys(df).forEach((term) => {
      result[term] = Math.log(docCount / (df[term] || 1)) + 1;
    });
    return result;
  }, [productDocs]);

  const tfidfVector = (tokens) => {
    const freq = {};
    tokens.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });
    const vec = {};
    Object.keys(freq).forEach((t) => {
      vec[t] = (freq[t] / tokens.length) * (idf[t] || 0);
    });
    return vec;
  };

  const cosineSim = (a, b) => {
    let dot = 0;
    let na = 0;
    let nb = 0;
    Object.keys(a).forEach((k) => {
      dot += a[k] * (b[k] || 0);
      na += a[k] * a[k];
    });
    Object.keys(b).forEach((k) => {
      nb += b[k] * b[k];
    });
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    return denom === 0 ? 0 : dot / denom;
  };

  const productVectors = useMemo(() => {
    return productDocs.map((doc) => tfidfVector(doc));
  }, [productDocs, idf]);

  const searchText = search.toLowerCase().trim();
  const queryTokens = tokenize(searchText);
  const queryVec = searchText ? tfidfVector(queryTokens) : {};

  const scoredProducts = useMemo(() => {
    return products.map((product, i) => {
      const score = searchText ? cosineSim(queryVec, productVectors[i]) : 0;
      return { product, score };
    });
  }, [products, searchText, queryVec, productVectors]);

  const substringFallback = (product) => {
    const haystack = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
    return queryTokens.every((q) => haystack.includes(q));
  };

  const filteredProducts = useMemo(() => {
    let result = scoredProducts
      .filter(({ product }) => {
        const matchesCategory =
          category === "All" || product.category === category;
        return matchesCategory;
      })
      .map(({ product, score }) => ({ product, score }));

    if (searchText) {
      result = result.filter(
        ({ product, score }) => score > 0 || substringFallback(product)
      );
      result.sort((a, b) => b.score - a.score);
    } else if (sort === "low") {
      result.sort((a, b) => a.product.price - b.product.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.product.price - a.product.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.product.rating - a.product.rating);
    }

    return result.map(({ product }) => product);
  }, [category, searchText, scoredProducts, sort, substringFallback]);

  // -------------------------------------------------------
  // 4.4 CART TOTALS
  // -------------------------------------------------------

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCharge = cartTotal >= 999 ? 0 : 49;

  const finalTotal = Math.max(
    0,
    cartTotal - couponDiscount
  ) + shippingCharge;

  // -------------------------------------------------------
  // Normalize selected product sizes (array or JSON string).
  // -------------------------------------------------------

  const displaySizes = useMemo(() => {
    let sizes = selectedProduct?.sizes;

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        sizes = [];
      }
    }

    return Array.isArray(sizes) ? sizes : [];
  }, [selectedProduct]);

  // -------------------------------------------------------
  // 4.5 NOTIFICATION
  // -------------------------------------------------------

  const showMessage = (text) => {
    setMessage(text);

    window.clearTimeout(showMessage.timeoutId);

    showMessage.timeoutId = window.setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // -------------------------------------------------------
  // 4.6 CART MANAGEMENT
  // -------------------------------------------------------

  const addToCart = (product, size) => {
    if (!size) {
      showMessage("Please select a size first.");
      return;
    }

    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        { ...product, size, quantity: 1 },
      ];
    });

    showMessage(`${product.name} added to cart!`);
  };

  const updateQuantity = (id, size, change) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );

    showMessage("Product removed from cart.");
  };

  // -------------------------------------------------------
  // 4.7 WISHLIST MANAGEMENT
  // -------------------------------------------------------

  const toggleWishlist = (id) => {
    setWishlist((previousWishlist) => {
      if (previousWishlist.includes(id)) {
        showMessage("Removed from wishlist.");
        return previousWishlist.filter((item) => item !== id);
      }

      showMessage("Added to wishlist!");
      return [...previousWishlist, id];
    });
  };

  // -------------------------------------------------------
  // 4.8 PRODUCT DETAILS
  // -------------------------------------------------------

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
  };

  // -------------------------------------------------------
  // 4.9 SCROLL TO PRODUCTS
  // -------------------------------------------------------

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  
  // -------------------------------------------------------
  // 4.10 LOGIN
  // Real backend login using FastAPI and Supabase
  // -------------------------------------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    if (!email || !password) {
      showMessage("Please enter email and password.");
      return;
    }

    try {
      setMessage("Logging in...");

      await loginUser({ email, password });

      const response = await getCurrentUser();
      const loggedInUser = response.user || response;

      setUser(loggedInUser);
      setActivePage("home");

      showMessage("Login successful!");
    } catch (error) {
      console.error("Login Error:", error);
      showMessage(error.message || "Login failed.");
    }
  };

  // -------------------------------------------------------
  // 4.11 SIGNUP
  // Register new user in database and login automatically
  // -------------------------------------------------------

  const handleSignup = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    if (!name || !email || !password) {
      showMessage("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      showMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setMessage("Creating your account...");

      await registerUser({
        name,
        email,
        password,
      });

      // Automatically login after successful signup
      await loginUser({
        email,
        password,
      });

      const response = await getCurrentUser();
      const loggedInUser = response.user || response;

      setUser(loggedInUser);
      setActivePage("home");

      showMessage("Account created successfully!");
    } catch (error) {
      console.error("Signup Error:", error);
      showMessage(error.message || "Signup failed.");
    }
  };

  // -------------------------------------------------------
  // 4.12 LOGOUT
  // Remove authentication token and logout user
  // -------------------------------------------------------

  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setActivePage("home");

    showMessage("Logged out successfully.");
  };

  // -------------------------------------------------------
  // 4.13 COUPON
  // Coupon: FASHION10 - 10% discount, maximum ₹300.
  // -------------------------------------------------------

  const applyCoupon = () => {
    if (checkoutData.coupon.trim().toUpperCase() === "FASHION10") {
      const discount = Math.min(cartTotal * 0.1, 300);

      setCouponDiscount(discount);
      showMessage("Coupon applied successfully!");
    } else {
      setCouponDiscount(0);
      showMessage("Invalid coupon code.");
    }
  };

  // -------------------------------------------------------
  // 4.14 PLACE ORDER
  // -------------------------------------------------------

  const placeOrder = (event) => {
    event.preventDefault();

    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      paymentMethod,
    } = checkoutData;

    if (cart.length === 0) {
      showMessage("Your cart is empty.");
      return;
    }

    if (
      !name.trim() ||
      !/^[6-9]\d{9}$/.test(phone) ||
      !email.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !/^\d{6}$/.test(pincode)
    ) {
      showMessage("Please enter valid delivery details.");
      return;
    }

    const shipping = cartTotal >= 999 ? 0 : 49;
    const total = Math.max(0, cartTotal - couponDiscount) + shipping;

    const newOrder = {
      id: `FS${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN"),
      items: [...cart],
      customer: { name, phone, email },
      address: `${address}, ${city}, ${state} - ${pincode}`,
      paymentMethod,
      subtotal: cartTotal,
      discount: couponDiscount,
      shipping,
      total,
      status: "Confirmed",
    };

    setOrders((previousOrders) => [
      newOrder,
      ...previousOrders,
    ]);

    setTrackingOrder(newOrder);
    setCart([]);
    setCouponDiscount(0);

    setCheckoutData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "Cash on Delivery",
      coupon: "",
    });

    setActivePage("confirmation");
    showMessage("Your order has been placed!");
  };

  // =======================================================
  // 5. EXTRA PAGES
  // =======================================================

  if (activePage !== "home") {
    const goHome = () => setActivePage("home");

    return (
      <>
        <style>{pageStyles}</style>

        <div className="extra-page">
          <div className="extra-header">
            <h2>
              Fashion <span style={{ color: "#8c62a7" }}>Shop.</span>
            </h2>

            <button className="extra-button" onClick={goHome}>
              ← Back to Shop
            </button>
          </div>

          {/* LOGIN PAGE */}
          {activePage === "login" && (
            <div className="extra-card">
              <h2>Welcome Back</h2>
              <p className="extra-muted">
                Login to your Fashion Shop account.
              </p>

              <form onSubmit={handleLogin}>
                <label>Email Address</label>
                <input
                  className="extra-field"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

                <label>Password</label>
                <input
                  className="extra-field"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />

                <button className="extra-button" type="submit">
                  Login
                </button>
              </form>

              <p>
                Don't have an account?
                <button
                  className="extra-button"
                  onClick={() => setActivePage("signup")}
                >
                  Create Account
                </button>
              </p>

              <p className="extra-muted">
                Demo login only. Real authentication will be added with backend.
              </p>
            </div>
          )}

          {/* SIGNUP PAGE */}
          {activePage === "signup" && (
            <div className="extra-card">
              <h2>Create Your Account</h2>

              <form onSubmit={handleSignup}>
                <label>Full Name</label>
                <input
                  className="extra-field"
                  name="name"
                  placeholder="Enter your full name"
                  required
                />

                <label>Email Address</label>
                <input
                  className="extra-field"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

                <label>Password</label>
                <input
                  className="extra-field"
                  name="password"
                  type="password"
                  minLength="6"
                  placeholder="Create password"
                  required
                />

                <button className="extra-button" type="submit">
                  Create Account
                </button>
              </form>

              <p className="extra-muted">
                Demo signup only. Account security will be implemented with backend.
              </p>
            </div>
          )}

          {/* PROFILE PAGE */}
          {activePage === "profile" && (
            <div className="extra-card">
              <h2>My Account</h2>

              {user ? (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Total Orders:</strong> {orders.length}</p>
                  <p><strong>Wishlist Items:</strong> {wishlist.length}</p>

                  <button
                    className="extra-button"
                    onClick={() => setActivePage("orders")}
                  >
                    My Orders
                  </button>

                  <button
                    className="extra-button"
                    onClick={() => setActivePage("wishlist")}
                  >
                    My Wishlist
                  </button>

                  <button
                    className="extra-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <p>You are not logged in.</p>
                  <button
                    className="extra-button"
                    onClick={() => setActivePage("login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          )}

          {/* WISHLIST PAGE */}
          {activePage === "wishlist" && (
            <section>
              <h2>My Wishlist ({wishlist.length})</h2>

              {products.filter((p) => wishlist.includes(p.id)).length === 0 ? (
                <div className="extra-card">
                  <h3>Your wishlist is empty.</h3>
                  <p>Save products you like and find them here.</p>
                  <button className="extra-button" onClick={goHome}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="extra-product-grid">
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((product) => (
                      <div className="extra-product-card" key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.brand}</p>
                        <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                        <div>
                          <button
                            className="extra-button"
                            onClick={() => {
                              setActivePage("home");
                              openProductDetails(product);
                            }}
                          >
                            View Product
                          </button>

                          <button
                            className="extra-button"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}

          {/* CHECKOUT PAGE */}
          {activePage === "checkout" && (
            <div className="extra-card">
              <h2>Checkout</h2>

              {cart.length === 0 ? (
                <>
                  <p>Your cart is empty.</p>
                  <button className="extra-button" onClick={goHome}>
                    Continue Shopping
                  </button>
                </>
              ) : (
                <>
                  <h3>Delivery Information</h3>

                  <form onSubmit={placeOrder}>
                    <label>Full Name</label>
                    <input
                      className="extra-field"
                      required
                      value={checkoutData.name}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          name: e.target.value,
                        })
                      }
                    />

                    <label>Mobile Number</label>
                    <input
                      className="extra-field"
                      required
                      maxLength="10"
                      inputMode="numeric"
                      value={checkoutData.phone}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />

                    <label>Email Address</label>
                    <input
                      className="extra-field"
                      type="email"
                      required
                      value={checkoutData.email}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          email: e.target.value,
                        })
                      }
                    />

                    <label>Full Address</label>
                    <textarea
                      className="extra-field"
                      required
                      rows="3"
                      value={checkoutData.address}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          address: e.target.value,
                        })
                      }
                    />

                    <label>City</label>
                    <input
                      className="extra-field"
                      required
                      value={checkoutData.city}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          city: e.target.value,
                        })
                      }
                    />

                    <label>State</label>
                    <input
                      className="extra-field"
                      required
                      value={checkoutData.state}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          state: e.target.value,
                        })
                      }
                    />

                    <label>PIN Code</label>
                    <input
                      className="extra-field"
                      required
                      maxLength="6"
                      inputMode="numeric"
                      value={checkoutData.pincode}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />

                    <hr className="extra-divider" />

                    <h3>Coupon Code</h3>
                    <input
                      className="extra-field"
                      placeholder="Enter FASHION10"
                      value={checkoutData.coupon}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          coupon: e.target.value,
                        })
                      }
                    />

                    <button
                      className="extra-button"
                      type="button"
                      onClick={applyCoupon}
                    >
                      Apply Coupon
                    </button>

                    <hr className="extra-divider" />

                    <h3>Payment Method</h3>
                    <select
                      className="extra-field"
                      value={checkoutData.paymentMethod}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option>Cash on Delivery</option>
                      <option>UPI (Demo only)</option>
                      <option>Card (Demo only)</option>
                    </select>

                    <h3>Order Summary</h3>

                    {cart.map((item) => (
                      <div
                        className="extra-summary-row"
                        key={`${item.id}-${item.size}`}
                      >
                        <span>
                          {item.name} ({item.size}) × {item.quantity}
                        </span>
                        <strong>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}

                    <hr className="extra-divider" />

                    <div className="extra-summary-row">
                      <span>Subtotal</span>
                      <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="extra-summary-row">
                      <span>Discount</span>
                      <strong>₹{couponDiscount.toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="extra-summary-row">
                      <span>Shipping</span>
                      <strong>₹{shippingCharge}</strong>
                    </div>

                    <hr className="extra-divider" />

                    <div className="extra-summary-row">
                      <h3>Total Amount</h3>
                      <h3>₹{finalTotal.toLocaleString("en-IN")}</h3>
                    </div>

                    <button className="extra-button" type="submit">
                      Place Order
                    </button>
                  </form>

                  <p className="extra-muted">
                    Demo checkout only. Online payment is not processed.
                    A payment gateway will be connected later.
                  </p>
                </>
              )}
            </div>
          )}

          {/* ORDER CONFIRMATION PAGE */}
          {activePage === "confirmation" && (
            <div className="extra-card">
              <h2>✓ Order Confirmed!</h2>

              {trackingOrder ? (
                <>
                  <p>Thank you for shopping with Fashion Shop.</p>

                  <p>
                    <strong>Order ID:</strong> {trackingOrder.id}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {trackingOrder.date}
                  </p>
                  <p>
                    <strong>Status:</strong> {trackingOrder.status}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{trackingOrder.total.toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Delivery Address:</strong> {trackingOrder.address}
                  </p>

                  <button
                    className="extra-button"
                    onClick={() => setActivePage("orders")}
                  >
                    View My Orders
                  </button>

                  <button
                    className="extra-button"
                    onClick={goHome}
                  >
                    Continue Shopping
                  </button>
                </>
              ) : (
                <p>Order information is not available.</p>
              )}
            </div>
          )}

          {/* MY ORDERS PAGE */}
          {activePage === "orders" && (
            <section>
              <h2>My Orders</h2>

              {orders.length === 0 ? (
                <div className="extra-card">
                  <h3>No orders yet.</h3>
                  <p>Your placed orders will appear here.</p>
                  <button className="extra-button" onClick={goHome}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div className="extra-order-card" key={order.id}>
                    <h3>Order #{order.id}</h3>
                    <p>Date: {order.date}</p>
                    <p>Products: {order.items.length}</p>
                    <p>
                      Total: ₹{order.total.toLocaleString("en-IN")}
                    </p>
                    <span className="extra-status">{order.status}</span>

                    <div>
                      <button
                        className="extra-button"
                        onClick={() => {
                          setTrackingOrder(order);
                          setActivePage("tracking");
                        }}
                      >
                        View Order Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {/* ORDER DETAILS PAGE */}
          {activePage === "tracking" && (
            <div className="extra-card">
              <h2>Order Details</h2>

              {trackingOrder ? (
                <>
                  <p>
                    <strong>Order ID:</strong> {trackingOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {trackingOrder.date}
                  </p>
                  <p>
                    <strong>Status:</strong> {trackingOrder.status}
                  </p>
                  <p>
                    <strong>Customer:</strong> {trackingOrder.customer.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {trackingOrder.customer.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {trackingOrder.address}
                  </p>
                  <p>
                    <strong>Payment:</strong> {trackingOrder.paymentMethod}
                  </p>

                  <hr className="extra-divider" />

                  <h3>Products</h3>

                  {trackingOrder.items.map((item, index) => (
                    <div
                      className="extra-summary-row"
                      key={`${item.id}-${item.size}-${index}`}
                    >
                      <span>
                        {item.name} ({item.size}) × {item.quantity}
                      </span>
                      <strong>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}

                  <hr className="extra-divider" />

                  <div className="extra-summary-row">
                    <span>Subtotal</span>
                    <strong>₹{trackingOrder.subtotal.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="extra-summary-row">
                    <span>Discount</span>
                    <strong>₹{trackingOrder.discount.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="extra-summary-row">
                    <span>Shipping</span>
                    <strong>₹{trackingOrder.shipping}</strong>
                  </div>

                  <div className="extra-summary-row">
                    <strong>Grand Total</strong>
                    <strong>₹{trackingOrder.total.toLocaleString("en-IN")}</strong>
                  </div>

                  <p className="extra-muted">
                    This is demo order information. Live courier tracking
                    will be added after delivery API integration.
                  </p>
                </>
              ) : (
                <p>Select an order from My Orders.</p>
              )}

              <button
                className="extra-button"
                onClick={() => setActivePage("orders")}
              >
                Back to My Orders
              </button>
            </div>
          )}

          {/* PAGE TOAST */}
          {message && <div className="toast">✓ {message}</div>}
        </div>
      </>
    );
  }

  // =======================================================
  // 6. HOMEPAGE
  // =======================================================

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#home">
          Fashion <span>Shop.</span>
        </a>

        <nav className="nav-links">
          <a href="#home" onClick={() => setCategory("All")}>Home</a>
          <a href="#products" onClick={() => setCategory("Men")}>Men</a>
          <a href="#products" onClick={() => setCategory("Women")}>Women</a>
          <a href="#products" onClick={() => setCategory("Kids")}>Kids</a>
        </nav>

        <div className="nav-actions">
          <form className="search-box" onSubmit={(event) => {
            event.preventDefault();
          }}>
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search for products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <button
            className="icon-button"
            aria-label="Wishlist"
            onClick={() => setActivePage("wishlist")}
          >
            ♡
            <span className="count-badge">{wishlist.length}</span>
          </button>

          <button
            className="icon-button cart-button"
            aria-label="Open shopping cart"
            onClick={() => setShowCart(true)}
          >
            ♧
            <span className="count-badge">{cartCount}</span>
          </button>

          <button
            className="login-button"
            onClick={() => setActivePage(user ? "profile" : "login")}
          >
            {user ? "My Account" : "Login"}
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="hero-label">
              NEW SEASON · NEW STYLE
            </span>

            <h1>
              Dress Your
              <br />
              <span>Own Story.</span>
            </h1>

            <p>
              Discover the latest fashion trends.
              Find your style, express yourself and
              make every outfit count.
            </p>

            <button className="primary-button" onClick={scrollToProducts}>
              Explore Collection <span>→</span>
            </button>

            <div className="hero-note">
              <strong>50% OFF</strong>
              <span>On selected styles</span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
              alt="Fashion collection"
            />

            <div className="hero-image-caption">
              <span>THE STYLE EDIT</span>
              <strong>Find Your Look.</strong>
            </div>
          </div>

          <div className="hero-decoration">FASHION</div>
        </section>

        {/* BENEFITS */}
        <section className="benefits">
          <div>
            <span>🚚</span>
            <div>
              <strong>Free Shipping</strong>
              <small>On orders above ₹999</small>
            </div>
          </div>

          <div>
            <span>↩</span>
            <div>
              <strong>Easy Returns</strong>
              <small>7-day return policy</small>
            </div>
          </div>

          <div>
            <span>🔒</span>
            <div>
              <strong>Secure Payment</strong>
              <small>Secure checkout</small>
            </div>
          </div>

          <div>
            <span>✧</span>
            <div>
              <strong>Latest Trends</strong>
              <small>Styles you'll love</small>
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="category-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE YOUR STYLE</span>
              <h2>Shop by Category</h2>
            </div>
            <p>Find something that feels like you.</p>
          </div>

          <div className="category-list">
            {categories.slice(1).map((item) => (
              <button
                className={`category-card category-${item.name.toLowerCase()}`}
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  scrollToProducts();
                }}
              >
                <span className="category-icon">{item.icon}</span>
                <span className="category-name">{item.name}</span>
                <span className="category-link">Explore Collection →</span>
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT SECTION */}
        <section className="products-section" id="products">
          <div className="section-heading product-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>Trending Collection</h2>
              <p className="product-count">
                {filteredProducts.length} products found
              </p>
            </div>

            <select
              className="sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="filter-tabs">
            {categories.map((item) => (
              <button
                key={item.name}
                className={category === item.name ? "active" : ""}
                onClick={() => setCategory(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>

         {productsLoading ? (
  <div className="empty-state">
    <h3>Loading products...</h3>
    <p>Please wait while we load our collection.</p>
  </div>
) : productsError ? (
  <div className="empty-state">
    <h3>Unable to load products</h3>
    <p>{productsError}</p>
    <button onClick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const discount = Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                );

                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => openProductDetails(product)}
                        style={{ cursor: "pointer" }}
                      />

                      <span className="product-tag">{product.tag}</span>

                      <button
                        className={`wishlist-button ${
                          wishlist.includes(product.id) ? "wishlisted" : ""
                        }`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Toggle wishlist"
                      >
                        {wishlist.includes(product.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="product-info">
                      <span className="product-brand">{product.brand}</span>

                      <h3
                        onClick={() => openProductDetails(product)}
                        style={{ cursor: "pointer" }}
                      >
                        {product.name}
                      </h3>

                      <div className="rating">★ {product.rating}</div>

                      <div className="price-row">
                        <strong>
                          ₹{product.price.toLocaleString("en-IN")}
                        </strong>
                        <del>
                          ₹{product.oldPrice.toLocaleString("en-IN")}
                        </del>
                        <span>{discount}% off</span>
                      </div>

                      <button
                        className="add-cart-button"
                        onClick={() => openProductDetails(product)}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No products found</h3>
              <p>Try another search or category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* PROMOTIONAL BANNER */}
        <section className="promo-banner">
          <div>
            <span className="eyebrow">YOUR STYLE, YOUR RULES</span>
            <h2>
              Make Room for
              <br />
              Something New.
            </h2>
            <p>
              Refresh your wardrobe with styles
              made for every moment.
            </p>
            <button className="light-button" onClick={scrollToProducts}>
              Shop Now →
            </button>
          </div>

          <div className="promo-mark">
            FS<span>.</span>
          </div>
        </section>
      </main>

      {/* SUPPORT CHAT */}
      <SupportChat />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-about">
            <a className="logo footer-logo" href="#home">
              Fashion <span>Shop.</span>
            </a>
            <p>
              Fashion is more than what you wear.
              It's how you express yourself.
              Discover your style with Fashion Shop.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#products">Shop</a>
            <a href="#products">New Arrivals</a>
          </div>

          <div>
            <h4>Customer Care</h4>
            <a href="#footer">Contact Us</a>
            <a href="#footer">Shipping Policy</a>
            <a href="#footer">Returns & Refunds</a>
            <button
              className="extra-button"
              onClick={() => setActivePage("orders")}
            >
              My Orders
            </button>
          </div>

          <div>
            <h4>Stay Connected</h4>
            <p>Get updates about new collections and offers.</p>
            <div className="newsletter">
              <input type="email" placeholder="Your email address" />
              <button
                aria-label="Subscribe"
                onClick={() => showMessage("Newsletter feature coming soon!")}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom" id="footer">
          <span>© 2026 Fashion Shop. All rights reserved.</span>
          <span>Made for your style ✦</span>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div
          className="details-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="details-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div className="details-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            </div>

            <div className="details-content">
              <span className="product-brand">
                {selectedProduct.brand}
              </span>

              <h2>{selectedProduct.name}</h2>

              <div className="rating">
                ★ {selectedProduct.rating} / 5
              </div>

              <div className="details-price">
                <strong>
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </strong>
                <del>
                  ₹{selectedProduct.oldPrice.toLocaleString("en-IN")}
                </del>
              </div>

              <p className="details-description">
                {selectedProduct.description}
              </p>

              
<h4>Select Size</h4>

<div className="size-options">
  {displaySizes.map((size) => (
    <button
      type="button"
      key={size}
      className={selectedSize === size ? "selected-size" : ""}
      onClick={() => setSelectedSize(size)}
    >
      {size}
    </button>
  ))}

  {displaySizes.length === 0 && <p>Size not available</p>}
</div>

<button
  className="add-cart-button details-add-button"
  onClick={() => {
    if (!selectedSize) {
      showMessage("Please select a size first.");
      return;
    }

    addToCart(selectedProduct, selectedSize);
    setSelectedProduct(null);
  }}
>
  Add to Cart
</button>

<p className="delivery-note">
  🚚 Free shipping on orders above ₹999
</p>
</div>
</div>
</div>
)}

      {/* SHOPPING CART DRAWER */}
      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <h2>My Shopping Cart</h2>
                <p>{cartCount} items in your cart</p>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="cart-close"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <span>🛍️</span>
                  <h3>Your cart is empty</h3>
                  <p>
                    Explore our collection and find your style.
                  </p>
                  <button onClick={() => setShowCart(false)}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    className="cart-item"
                    key={`${item.id}-${item.size}`}
                  >
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size}</p>

                      <strong>
                        ₹{item.price.toLocaleString("en-IN")}
                      </strong>

                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, -1)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.id, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total Amount</span>
                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    setShowCart(false);
                    setActivePage("checkout");
                  }}
                >
                  Proceed to Checkout →
                </button>

                <p>Secure shopping at Fashion Shop</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* HOME PAGE TOAST */}
      {message && <div className="toast">✓ {message}</div>}
    </div>
  );
}

// =======================================================
// 7. EXPORT
// =======================================================

export default App;
