const http = require('http');

const salesData = [
  { id: 1, productName: 'Professional Laptop', category: 'Electronics', amount: 1200.00, saleDate: '2026-02-01T00:00:00', region: 'North' },
  { id: 2, productName: 'Wireless Mouse', category: 'Electronics', amount: 25.50, saleDate: '2026-02-02T00:00:00', region: 'South' },
  { id: 3, productName: 'Designer Desk', category: 'Furniture', amount: 450.00, saleDate: '2026-02-03T00:00:00', region: 'East' },
  { id: 4, productName: 'Ergonomic Chair', category: 'Furniture', amount: 299.99, saleDate: '2026-02-04T00:00:00', region: 'West' },
  { id: 5, productName: 'Monitor 4K', category: 'Electronics', amount: 350.00, saleDate: '2026-02-05T00:00:00', region: 'North' },
  { id: 6, productName: 'USB-C Hub', category: 'Electronics', amount: 45.00, saleDate: '2026-02-06T00:00:00', region: 'South' },
  { id: 7, productName: 'Bookshelf', category: 'Furniture', amount: 120.00, saleDate: '2026-02-07T00:00:00', region: 'East' }
];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/report' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(salesData));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Mock REST Service running at http://localhost:${PORT}/api/report`);
});
