// Sorting, Filtering, Searching
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");
const productList = document.getElementById("product-list");

function getProducts() {
  return Array.from(productList.getElementsByClassName("product"));
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach(p => productList.appendChild(p));
}

// Sort
sortSelect.addEventListener("change", () => {
  let products = getProducts();
  if (sortSelect.value === "low-high") {
    products.sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (sortSelect.value === "high-low") {
    products.sort((a, b) => b.dataset.price - a.dataset.price);
  } else if (sortSelect.value === "az") {
    products.sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent));
  } else if (sortSelect.value === "za") {
    products.sort((a, b) => b.querySelector("h3").textContent.localeCompare(a.querySelector("h3").textContent));
  }
  renderProducts(products);
});

// Filter
filterSelect.addEventListener("change", () => {
  let products = getProducts();
  products.forEach(p => {
    if (!filterSelect.value || p.dataset.category === filterSelect.value) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
});

// Search
searchInput.addEventListener("input", () => {
  let products = getProducts();
  let query = searchInput.value.toLowerCase();
  products.forEach(p => {
    let name = p.querySelector("h3").textContent.toLowerCase();
    if (name.includes(query)) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
});