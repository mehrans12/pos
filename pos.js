// ---------- GLOBAL STATE ----------
let allProducts = [];
let filteredCategory = "all";
let cart = [];

// ---------- DOM READY ----------
window.onload = () => {
  // Use globally exported products from products.js (loaded before this script)
  allProducts = window.PRODUCTS || Storage.get("pos_products", []);

  // Ensure valid array
  if (!Array.isArray(allProducts)) allProducts = [];
  allProducts = allProducts.filter(p => p && typeof p === 'object' && ('id' in p) && ('name' in p));

  // Guard: if still empty, don't render
  if (allProducts.length === 0) {
    console.error("No valid products loaded");
    document.getElementById("productGrid").innerHTML = "<p style='color:red;'>Error: No products available. Check console.</p>";
    return;
  }

  renderCategories();
  renderProducts();
  setupSearch();
};

// ---------- RENDER CATEGORIES ----------
function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  const categories = ["all", ...new Set(allProducts.map(p => p.category))];

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.dataset.category = cat;
    if (cat === "all") li.classList.add("active");

    li.onclick = () => {
      document.querySelectorAll("#categoryList li")
        .forEach(el => el.classList.remove("active"));

      li.classList.add("active");
      filteredCategory = cat;
      renderProducts();
    };

    categoryList.appendChild(li);
  });
}

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const visibleProducts = filteredCategory === "all"
    ? allProducts
    : allProducts.filter(p => p.category === filteredCategory);

  if (visibleProducts.length === 0) {
    grid.innerHTML = "<p>No products found</p>";
    return;
  }

  visibleProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>Rs. ${product.price}</p>
      <small>${product.category}</small>
    `;

    card.onclick = () => addToCart(product);
    grid.appendChild(card);
  });
}

// ---------- SEARCH ----------
function setupSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("keyup", e => {
    const value = e.target.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(value) ||
      p.barcode.includes(value)
    );

    displayFilteredProducts(filtered);
  });
}

function displayFilteredProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}">
      <h4>${product.name}</h4>
      <p>Rs. ${product.price}</p>
    `;
    card.onclick = () => addToCart(product);
    grid.appendChild(card);
  });
}

// ---------- CART ----------
function addToCart(product) {
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} (${item.qty})</span>
      <div class="cart-actions">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button class="remove-btn" onclick="removeItem(${item.id})">x</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = subtotal;
  document.getElementById("tax").textContent = tax;
  document.getElementById("total").textContent = total;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) removeItem(id);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function completeSale() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const receipt = document.getElementById("receipt");
  receipt.style.display = "block"; // make visible

  // Date & Time
  const now = new Date();
  document.getElementById("r-date").textContent = now.toLocaleDateString();
  document.getElementById("r-time").textContent = now.toLocaleTimeString();

  // Items
  const itemsDiv = document.getElementById("r-items");
  itemsDiv.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const line = document.createElement("p");
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    line.textContent = `${item.name}  x${item.qty}   Rs ${lineTotal}`;
    itemsDiv.appendChild(line);
  });

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById("r-subtotal").textContent = subtotal;
  document.getElementById("r-tax").textContent = tax;
  document.getElementById("r-total").textContent = total;

  // Save sale record to storage (reuse 'now' from above)
  const saleRecord = {
    id: Date.now(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    subtotal,
    tax,
    total
  };

  const sales = Storage.get("pos_sales", []);
  sales.push(saleRecord);
  Storage.set("pos_sales", sales);

  // generate QR if library present
  const qrCanvas = document.getElementById("qrCode");
  if (window.QRCode && qrCanvas) {
    let qrText = `Sale: ${saleRecord.date} ${saleRecord.time}\nTotal: ${saleRecord.total}\n`;
    saleRecord.items.forEach(i => qrText += `${i.name} x${i.qty} = ${i.price * i.qty}\n`);
    try { QRCode.toCanvas(qrCanvas, qrText, { width: 120 }); } catch (e) { /* ignore */ }
  }

  // IMPORTANT: wait for DOM to update
  setTimeout(() => {
    window.print();

    // After print
    receipt.style.display = "none";
    cart = [];
    renderCart();
  }, 300);
}

