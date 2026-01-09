// Default product list
const DEFAULT_PRODUCTS = [
  {id:1,name:"Tea",price:120,barcode:"100001",category:"Beverages",image:"https://placehold.co/100x100?text=Tea"},
    {id:2,name:"Coffee",price:250,barcode:"100002",category:"Beverages",image:"https://placehold.co/100x100?text=Coffee"},
    {id:3,name:"Biscuit",price:60,barcode:"100003",category:"Snacks",image:"https://placehold.co/100x100?text=Biscuit"},
    {id:4,name:"Milk",price:90,barcode:"100004",category:"Dairy",image:"https://placehold.co/100x100?text=Milk"},
    {id:5,name:"Sugar",price:80,barcode:"100005",category:"Groceries",image:"https://placehold.co/100x100?text=Sugar"},
    {id:6,name:"Bread",price:50,barcode:"100006",category:"Bakery",image:"https://placehold.co/100x100?text=Bread"},
    {id:7,name:"Butter",price:200,barcode:"100007",category:"Dairy",image:"https://placehold.co/100x100?text=Butter"},
    {id:8,name:"Cheese",price:300,barcode:"100008",category:"Dairy",image:"https://placehold.co/100x100?text=Cheese"},
    {id:9,name:"Chocolate",price:150,barcode:"100009",category:"Snacks",image:"https://placehold.co/100x100?text=Chocolate"},
    {id:10,name:"Juice",price:120,barcode:"100010",category:"Beverages",image:"https://placehold.co/100x100?text=Juice"},
    {id:11,name:"Water",price:30,barcode:"100011",category:"Beverages",image:"https://placehold.co/100x100?text=Water"},
    {id:12,name:"Ice Cream",price:250,barcode:"100012",category:"Snacks",image:"https://placehold.co/100x100?text=Ice+Cream"},
    {id:13,name:"Chips",price:80,barcode:"100013",category:"Snacks",image:"https://placehold.co/100x100?text=Chips"},
    {id:14,name:"Cookies",price:90,barcode:"100014",category:"Snacks",image:"https://placehold.co/100x100?text=Cookies"},
    {id:15,name:"Jam",price:180,barcode:"100015",category:"Groceries",image:"https://placehold.co/100x100?text=Jam"},
    {id:16,name:"Honey",price:220,barcode:"100016",category:"Groceries",image:"https://placehold.co/100x100?text=Honey"},
    {id:17,name:"Eggs",price:150,barcode:"100017",category:"Dairy",image:"https://placehold.co/100x100?text=Eggs"},
    {id:18,name:"Rice",price:400,barcode:"100018",category:"Groceries",image:"https://placehold.co/100x100?text=Rice"},
    {id:19,name:"Flour",price:300,barcode:"100019",category:"Groceries",image:"https://placehold.co/100x100?text=Flour"},
    {id:20,name:"Oil",price:350,barcode:"100020",category:"Groceries",image:"https://placehold.co/100x100?text=Oil"}
];

// Try to load from storage; if missing, seed defaults
let products = Storage.get("pos_products", null);
if (!Array.isArray(products) || products.length === 0) {
  products = DEFAULT_PRODUCTS;
  Storage.set("pos_products", products);
}

// Export to global scope so pos.js can access immediately
window.PRODUCTS = products;
