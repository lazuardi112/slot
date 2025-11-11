const express = require('express');
const path = require('path');
const midtransClient = require('midtrans-client');
const app = express();
const port = 5001;

// Create Core API instance
// TODO: Replace with your actual Midtrans credentials
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'YOUR_SERVER_KEY',
    clientKey: 'YOUR_CLIENT_KEY'
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});