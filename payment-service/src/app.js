const express = require('express');
const bodyParser = require('body-parser');
const { processPayment } = require('./services/payment_processing');

const app = express();
app.use(bodyParser.json());

app.post('/payment', async (req, res) => {
    try {
        const paymentId = await processPayment(req.body);
        res.status(201).json({ paymentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Payment service running on port 3001');
});