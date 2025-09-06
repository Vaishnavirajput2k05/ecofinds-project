// Import the built-in 'http' and 'fs' (File System) modules
const http = require('http');
const fs = require('fs');

// Create the server
const server = http.createServer((req, res) => {
    // Set CORS headers to allow your client to fetch data from this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight requests for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // GET request to fetch all products
    if (req.url === '/api/products' && req.method === 'GET') {
        fs.readFile('db.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error reading database file' }));
                return;
            }
            const jsonData = JSON.parse(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonData.products));
        });


        // POST request to add a new product
    } else if (req.url === '/api/products' && req.method === 'POST') {
        let body = '';

        // Node.js streams data in chunks. We need to listen for these chunks.
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to our 'body' variable
        });

        // When all chunks have arrived, the 'end' event is fired.
        req.on('end', () => {
            fs.readFile('db.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error reading database file' }));
                    return;
                }

                const db = JSON.parse(data); // The entire database object
                const newProduct = JSON.parse(body); // The new product from the client

                // Create a simple unique ID for the new product
                newProduct.id = Date.now();
                // For now, let's assign it to our default user
                newProduct.ownerId = 1;


                // Add the new product to our products array
                db.products.push(newProduct);

                // Write the entire updated database back to the file
                fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Error writing to database' }));
                        return;
                    }

                    // Respond with a "201 Created" status and the new product data
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newProduct));
                });
            });
        });

    } else if (req.url === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.readFile('db.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { message: 'Server error' });
                    return res.end();
                }

                const { users } = JSON.parse(data);
                const { email, password } = JSON.parse(body);

                const foundUser = users.find(user => user.email === email && user.password === password);

                if (foundUser) {
                    // This is where you send the foundUser data back
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful', user: foundUser }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid email or password' }));
                }
            });
        });

    } else if (req.url.startsWith('/api/my-products') && req.method === 'GET') {
        // Example URL: /api/my-products?userId=1
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = parseInt(url.searchParams.get('userId'), 10);

        fs.readFile('db.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Server error' }));
                return;
            }

            const { products } = JSON.parse(data);
            // Filter products to find ones where ownerId matches the userId from the URL
            const userProducts = products.filter(product => product.ownerId === userId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userProducts));
        });

    } else if (req.url.startsWith('/api/products/') && req.method === 'GET') {
        const id = parseInt(req.url.split('/')[3], 10);
        fs.readFile('db.json', 'utf8', (err, data) => {
            const { products } = JSON.parse(data);
            const product = products.find(p => p.id === id);
            if (product) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(product));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Product not found' }));
            }
        });
    } else if (req.url.startsWith('/api/products/') && req.method === 'PUT') {
        const id = parseInt(req.url.split('/')[3], 10);
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            fs.readFile('db.json', 'utf8', (err, data) => {
                const db = JSON.parse(data);
                const updatedProductData = JSON.parse(body);
                // Find the index of the product to update
                const productIndex = db.products.findIndex(p => p.id === id);

                if (productIndex !== -1) {
                    // Update the product in the array
                    db.products[productIndex] = { ...db.products[productIndex], ...updatedProductData };
                    fs.writeFile('db.json', JSON.stringify(db, null, 2), err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(db.products[productIndex]));
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Product not found' }));
                }
            });
        });

    } else if (req.url.startsWith('/api/products/') && req.method === 'DELETE') {
        // Example URL: /api/products/1678886400000
        const id = parseInt(req.url.split('/')[3], 10); // Get the ID from the URL

        fs.readFile('db.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Server error' }));
            }

            const db = JSON.parse(data);
            // Create a new array of products that does NOT include the one with the matching ID
            const updatedProducts = db.products.filter(product => product.id !== id);

            // Update the database object
            db.products = updatedProducts;

            fs.writeFile('db.json', JSON.stringify(db, null, 2), err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Error writing to database' }));
                }

                // Send a success response indicating no content to return
                res.writeHead(204);
                res.end();
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});