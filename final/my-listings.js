document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP & USER AUTHENTICATION ---
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userDisplay = document.getElementById('user-display');
    const logoutLink = document.getElementById('logout-link');
    const productContainer = document.getElementById('my-product-list-container');

    // If the user isn't logged in, redirect them immediately.
    if (!userId) {
        window.location.href = 'login.html';
        return; // Stop the rest of the script from running
    }

    // --- 2. SETUP EVENT LISTENERS (Correct Placement) ---
    // Welcome message
    userDisplay.textContent = `Welcome, ${username}!`;

    // Logout link listener
    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });

    // Use a single event listener on the container for both Edit and Delete
    productContainer.addEventListener('click', (event) => {
        const button = event.target;
        const productId = button.dataset.productId;

        if (button.matches('.edit-btn')) {
            handleEdit(productId);
        }

        if (button.matches('.delete-btn')) {
            handleDelete(productId, button);
        }
    });

    // --- 3. INITIAL DATA FETCH ---
    fetchMyProducts(userId, productContainer);
});


// --- Fetches and displays the user's products ---
async function fetchMyProducts(userId, container) {
    try {
        const response = await fetch(`http://localhost:3001/api/my-products?userId=${userId}`);
        const products = await response.json();

        if (products.length === 0) {
            container.innerHTML = '<p>You have not listed any products yet.</p>';
            return;
        }

        container.innerHTML = ''; // Clear the container
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // Both buttons now correctly have the data-product-id attribute
            productCard.innerHTML = `
                <img src="${product.imagePlaceholder}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="card-actions">
                    <button class="edit-btn" data-product-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-product-id="${product.id}">Delete</button>
                </div>
            `;
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Failed to fetch your products:', error);
        container.innerHTML = '<p>Error loading your products.</p>';
    }
}

// --- Handler for Edit button clicks ---
function handleEdit(productId) {
    if (!productId) return;
    // Redirect to the edit page, passing the product ID in the URL
    window.location.href = `edit-product.html?id=${productId}`;
}

// --- Handler for Delete button clicks ---
async function handleDelete(productId, buttonElement) {
    if (!productId) return;

    // Ask for confirmation
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                alert('Product deleted successfully!');
                // Remove the product card from the view without a page reload
                buttonElement.closest('.product-card').remove();
            } else {
                alert('Failed to delete product.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}