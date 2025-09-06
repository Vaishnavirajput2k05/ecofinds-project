document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get the values from all form inputs, including the new one
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const imageUrl = document.getElementById('imageUrl').value; // Get the image URL
        const description = document.getElementById('description').value;

        // Create a product object from the form data
        const newProduct = {
            title: title,
            category: category,
            price: parseFloat(price),
            // Use the provided URL, or a default placeholder if the field is empty
            imagePlaceholder: imageUrl || "https://via.placeholder.com/150",
            description: description
        };

        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.status === 201) {
                alert('Product added successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        }
    });
});