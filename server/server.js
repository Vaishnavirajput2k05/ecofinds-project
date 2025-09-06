// Import the built-in 'http' and 'fs' (File System) modules
const http = require('http');
const fs = require('fs');

// Create the server
const server = http.createServer((req, res) => {
    // This function runs for every request that hits your server

    // Set CORS headers to allow your client to fetch data from this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // This is a simple router. It checks the URL of the request.
    if (req.url === '/api/products' && req.method === 'GET') {

        // If the URL is '/api/products', read our database file
        fs.readFile('db.json', 'utf8', (err, data) => {
            if (err) {
                // If there's an error reading the file, send a server error response
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error reading database file' }));
                return;
            }

            // If successful, parse the JSON data and get the products
            const jsonData = JSON.parse(data);
            const products = jsonData.products;

            // Send a 200 OK response with the product data
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        });

    } else {
        // If the URL is anything else, send a 404 Not Found error
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

// Define the port number the server will listen on
const PORT = 3001;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
