// This function runs as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Function to fetch product data from our server
async function fetchProducts() {
    const productContainer = document.getElementById('product-list-container');

    try {
        // Call our backend API endpoint
        const response = await fetch('http://localhost:3001/api/products');
        const products = await response.json();

        // Clear any loading message
        productContainer.innerHTML = '';

        // Loop through each product and create an HTML card for it
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card'; // Add a class for styling

            // Use the data to build the HTML for the card [cite: 19, 21]
            productCard.innerHTML = `
                <img src="${product.imagePlaceholder}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
            `;

            // Add the new card to the container
            productContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error('Failed to fetch products:', error);
        productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}
