const table = document.getElementById("salesTable");
const receiptContainer = document.getElementById("receipt");

function loadSales() {
  const sales = Storage.get("pos_sales", []);
  table.innerHTML = "";

  sales.forEach(sale => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sale.date}</td>
      <td>${sale.time}</td>
      <td>${sale.total}</td>
      <td><button class="reprint" onclick='reprint(${sale.id})'>Reprint</button></td>
    `;
    table.appendChild(tr);
  });
}

function reprint(id) {
  const sales = Storage.get("pos_sales", []);
  const sale = sales.find(s => s.id === id);
  if (!sale) return alert("Sale not found");

  // Generate receipt content
  receiptContainer.innerHTML = `
    <div class="receipt">
      <img src="assets/images/logo.png" class="receipt-logo">
      <h2>Mehran's Ecommerce POS</h2>
      <p class="tagline">Your trusted store since 2026</p>
      <p class="contact">📞 +92 300 0000000  | 📧 info@mehranpos.com</p>
      <hr>
      <p>Date: ${sale.date}  Time: ${sale.time}</p>
      <hr>
      <div id="r-items">
        ${sale.items.map(item => {
          const lineTotal = item.price * item.qty;
          const name = item.name.length > 12 ? item.name.slice(0,12)+'…' : item.name;
          return `<p>${name.padEnd(12)} ${item.qty.toString().padStart(2)} x ${item.price.toString().padStart(3)} = ${lineTotal}</p>`;
        }).join('')}
      </div>
      <hr>
      <div class="receipt-totals">
        <div>Subtotal: ${sale.subtotal}</div>
        <div>Tax (5%): ${sale.tax}</div>
        <div class="total">Total: ${sale.total}</div>
      </div>
      <hr>
      <canvas id="qrCode"></canvas>
      <p class="thank-you">Thank you for shopping!</p>
      <p class="footer">Visit: www.mehranpos.com | Follow: @mehranpos</p>
    </div>
  `;

  // Generate QR
  const qrCanvas = receiptContainer.querySelector("#qrCode");
  let qrText = `Sale on ${sale.date} ${sale.time}\nTotal: ${sale.total}\nItems:\n`;
  sale.items.forEach(i => qrText += `${i.name} x${i.qty} = ${i.price*i.qty}\n`);
  QRCode.toCanvas(qrCanvas, qrText, { width: 120 });

  // Print
  setTimeout(() => {
    window.print();
    receiptContainer.innerHTML = "";
  }, 400);
}

loadSales();
