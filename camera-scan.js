Quagga.init({
  inputStream: {
    type: "LiveStream",
    target: document.querySelector("#scanner"),
    constraints: {
      facingMode: "environment"
    }
  },
  decoder: {
    readers: ["ean_reader", "code_128_reader", "upc_reader"]
  }
}, function (err) {
  if (err) {
    console.error(err);
    return;
  }
  Quagga.start();
});

Quagga.onDetected(function (data) {
  const code = data.codeResult.code;

  // Send barcode back to POS
  localStorage.setItem("last_scanned_barcode", code);

  alert("Scanned: " + code);

  Quagga.stop();
  window.close();
});
