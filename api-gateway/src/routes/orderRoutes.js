const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/order', async (req, res) => {
    try {
        const response = await axios.post('http://order-service:3000/order', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/payment', async (req, res) => {
    try {
        const response = await axios.post('http://payment-service:3001/payment', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/shipment', async (req, res) => {
    try {
        const response = await axios.post('http://shipping-service:3002/shipment', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;