
// ==========================================
// FASHION SHOP - PRODUCT DATABASE
// Demo product data.
// Baad mein isi structure ko backend API se replace karenge.
// ==========================================

export const products = [

  // Men's products
  {
    id: 1,
    name: "Classic White T-Shirt",
    brand: "Roadster",
    category: "Men",
    gender: "Men",
    price: 499,
    originalPrice: 999,
    rating: 4.5,
    discount: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
    fabric: "Cotton",
    fit: "Regular",
    stock: 25,
    isNew: true
  },
  {
    id: 2,
    name: "Men's Denim Jacket",
    brand: "Levis",
    category: "Men",
    gender: "Men",
    price: 1499,
    originalPrice: 2499,
    rating: 4.3,
    discount: 40,
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600",
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Black"],
    fabric: "Denim",
    fit: "Regular",
    stock: 12,
    isNew: false
  },
  {
    id: 3,
    name: "Men's Casual Shirt",
    brand: "Allen Solly",
    category: "Men",
    gender: "Men",
    price: 899,
    originalPrice: 1499,
    rating: 4.2,
    discount: 40,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "White"],
    fabric: "Cotton",
    fit: "Slim",
    stock: 18,
    isNew: true
  },

  // Women's products
  {
    id: 4,
    name: "Women's Summer Dress",
    brand: "Tokyo Talkies",
    category: "Women",
    gender: "Women",
    price: 799,
    originalPrice: 1599,
    rating: 4.6,
    discount: 50,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",
    sizes: ["S", "M", "L"],
    colors: ["Pink", "Black"],
    fabric: "Polyester",
    fit: "Regular",
    stock: 20,
    isNew: true
  },
  {
    id: 5,
    name: "Women's Casual Top",
    brand: "H&M",
    category: "Women",
    gender: "Women",
    price: 599,
    originalPrice: 999,
    rating: 4.4,
    discount: 40,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Pink"],
    fabric: "Cotton",
    fit: "Regular",
    stock: 15,
    isNew: false
  },
  {
    id: 6,
    name: "Women's Fashion Jacket",
    brand: "Zara",
    category: "Women",
    gender: "Women",
    price: 1799,
    originalPrice: 2999,
    rating: 4.7,
    discount: 40,
    image: "https://images.unsplash.com/photo-1548624149-f3f4f5b7c5e6?w=600",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    fabric: "Denim",
    fit: "Oversized",
    stock: 8,
    isNew: true
  },

  // Kids' products
  {
    id: 7,
    name: "Kids Printed T-Shirt",
    brand: "Hopscotch",
    category: "Kids",
    gender: "Kids",
    price: 349,
    originalPrice: 699,
    rating: 4.3,
    discount: 50,
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=600",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: ["Yellow", "Blue"],
    fabric: "Cotton",
    fit: "Regular",
    stock: 30,
    isNew: true
  },
  {
    id: 8,
    name: "Kids Casual Outfit",
    brand: "Mothercare",
    category: "Kids",
    gender: "Kids",
    price: 899,
    originalPrice: 1299,
    rating: 4.5,
    discount: 31,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
    sizes: ["2Y", "4Y", "6Y"],
    colors: ["Pink", "Blue"],
    fabric: "Cotton",
    fit: "Regular",
    stock: 10,
    isNew: false
  }

];

// ==========================================
// GET PRODUCT BY ID
// ==========================================

export const getProductById = (id) => {
  return products.find(
    (product) => String(product.id) === String(id)
  );
};

// ==========================================
// GET PRODUCTS BY CATEGORY
// ==========================================

export const getProductsByCategory = (category) => {

  if (!category || category === "All") {
    return products;
  }

  return products.filter(
    (product) => product.category === category
  );

};
