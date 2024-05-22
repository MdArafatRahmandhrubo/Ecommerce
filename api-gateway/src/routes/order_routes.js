const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/order', async (req, res) => {
    try {
        const orderResponse = await axios.post('http://localhost:3000/order', req.body);
        res.status(201).json(orderResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/payment', async (req, res) => {
    try {
        const paymentResponse = await axios.post('http://localhost:3001/payment', req.body);
        res.status(201).json(paymentResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/shipping', async (req, res) => {
    try {
        const shippingResponse = await axios.post('http://localhost:3002/shipping', req.body);
        res.status(201).json(shippingResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;