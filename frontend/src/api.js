
const API_BASE_URL = "http://127.0.0.1:8000";

// Common API request function
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("fashionShopToken");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Something went wrong"
    );
  }

  return data;
}

// Get all products
export async function getProducts() {
  return apiRequest("/api/products");
}

// Register new user
export async function registerUser(userData) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login existing user
export async function loginUser(userData) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (data.access_token) {
    localStorage.setItem("fashionShopToken", data.access_token);
  }

  return data;
}

// Get logged-in user details
export async function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

// Logout user
export function logoutUser() {
  localStorage.removeItem("fashionShopToken");
}
