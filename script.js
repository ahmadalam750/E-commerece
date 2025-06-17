// DOM Elements
const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const continueShoppingBtn = document.getElementById("continue-shopping");

// Templates
const productTemplate = document.getElementById("product-template");
const cartItemTemplate = document.getElementById("cart-item-template");

// Global Variables
let products = [];
let cart = [];

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML =
      '<div class="no-results">Failed to load products. Please try again later.</div>';
  }
}

// Display products in the grid
function displayProducts(productsToDisplay) {
  productsContainer.innerHTML = "";

  if (productsToDisplay.length === 0) {
    productsContainer.innerHTML =
      '<div class="no-results">No products found matching your search.</div>';
    return;
  }

  productsToDisplay.forEach((product) => {
    const productCard = document.importNode(productTemplate.content, true);

    const productImage = productCard.querySelector(".product-image img");
    productImage.src = product.image;
    productImage.alt = product.title;

    productCard.querySelector(".product-title").textContent = product.title;
    productCard.querySelector(".product-description").textContent =
      product.description;
    productCard.querySelector(
      ".product-price"
    ).textContent = `$${product.price.toFixed(2)}`;

    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => addToCart(product));

    productsContainer.appendChild(productCard);
  });
}

// Search products
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    displayProducts(products);
    return;
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );

  displayProducts(filteredProducts);
}

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  saveCartToLocalStorage();

  // Show cart sidebar
  openCart();
}

// Remove product from cart
function removeFromCart(productId) {
  const existingItemIndex = cart.findIndex((item) => item.id === productId);

  if (existingItemIndex !== -1) {
    if (cart[existingItemIndex].quantity > 1) {
      cart[existingItemIndex].quantity -= 1;
    } else {
      cart.splice(existingItemIndex, 1);
    }

    updateCart();
    saveCartToLocalStorage();
  }
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    cartCount.textContent = "0";
    cartTotalPrice.textContent = "$0.00";
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    const cartItem = document.importNode(cartItemTemplate.content, true);

    const itemImage = cartItem.querySelector(".cart-item-image img");
    itemImage.src = item.image;
    itemImage.alt = item.title;

    cartItem.querySelector(".cart-item-title").textContent = item.title;
    cartItem.querySelector(".cart-item-price").textContent = `$${(
      item.price * item.quantity
    ).toFixed(2)}`;
    cartItem.querySelector(".quantity-value").textContent = item.quantity;

    const decreaseBtn = cartItem.querySelector(".decrease-quantity");
    decreaseBtn.addEventListener("click", () => removeFromCart(item.id));

    const increaseBtn = cartItem.querySelector(".increase-quantity");
    increaseBtn.addEventListener("click", () => addToCart(item));

    cartItemsContainer.appendChild(cartItem);

    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  cartCount.textContent = totalItems;
  cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Save cart to local storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from local storage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Open cart sidebar
function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close cart sidebar
function closeCart() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  loadCartFromLocalStorage();
});

searchInput.addEventListener("input", searchProducts);
searchButton.addEventListener("click", searchProducts);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchProducts();
  }
});

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
continueShoppingBtn.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  alert("Checkout functionality would be implemented here!");
});
