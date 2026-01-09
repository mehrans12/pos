let products = Storage.get("pos_products", []);
const table = document.getElementById("productTable");
const form = document.getElementById("productForm");

// Explicit DOM references for form fields (avoid relying on implicit globals)
const productId = document.getElementById("productId");
const name = document.getElementById("name");
const price = document.getElementById("price");
const barcode = document.getElementById("barcode");
const category = document.getElementById("category");
const image = document.getElementById("image");

renderTable();

// ---------- FORM SUBMIT ----------
form.onsubmit = e => {
  e.preventDefault();

  const id = productId.value;
  const product = {
    id: id ? Number(id) : Date.now(),
    name: name.value,
    price: Number(price.value),
    barcode: barcode.value,
    category: category.value,
    image: image.value || "assets/images/default.png"
  };

  if (id) {
    products = products.map(p => p.id === product.id ? product : p);
  } else {
    products.push(product);
  }

  Storage.set("pos_products", products);
  form.reset();
  renderTable();
};

// ---------- RENDER TABLE ----------
function renderTable() {
  table.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.barcode}</td>
      <td>${p.category}</td>
      <td class="actions">
        <button class="edit" onclick="editProduct(${p.id})">Edit</button>
        <button class="delete" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

// ---------- EDIT ----------
function editProduct(id) {
  const p = products.find(p => p.id === id);
  productId.value = p.id;
  name.value = p.name;
  price.value = p.price;
  barcode.value = p.barcode;
  category.value = p.category;
  image.value = p.image;
}

// ---------- DELETE ----------
function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  products = products.filter(p => p.id !== id);
  Storage.set("pos_products", products);
  renderTable();
}
