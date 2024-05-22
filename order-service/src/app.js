const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('./middlewares/rate_limit_middleware');
const { placeOrder } = require('./services/transaction_management');

const app = express();
app.use(bodyParser.json());
app.use(rateLimit);

app.post('/order', async (req, res) => {
    try {
        const orderId = await placeOrder(req.body);
        res.status(201).json({ orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Order service running on port 3000');
});