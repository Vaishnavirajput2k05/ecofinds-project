document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('edit-product-form');

    // 1. Get the product ID from the URL's query parameters
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // If there's no ID, redirect back to the listings page
    if (!productId) {
        window.location.href = 'my-listings.html';
        return;
    }

    // 2. Fetch the existing product data from the server
    try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();

        // 3. Populate the form fields with the fetched data
        document.getElementById('title').value = product.title;
        document.getElementById('category').value = product.category;
        document.getElementById('price').value = product.price;
        document.getElementById('imageUrl').value = product.imagePlaceholder;
        document.getElementById('description').value = product.description;

    } catch (error) {
        console.error('Failed to load product data:', error);
        alert('Could not load product data.');
        window.location.href = 'my-listings.html';
    }

    // 4. Handle the form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Gather the updated data from the form
        const updatedProduct = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            imagePlaceholder: document.getElementById('imageUrl').value,
            description: document.getElementById('description').value
        };

        // 5. Send the updated data to the server using the PUT method
        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                alert('Product updated successfully!');
                window.location.href = 'my-listings.html'; // Redirect back
            } else {
                alert('Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });
});