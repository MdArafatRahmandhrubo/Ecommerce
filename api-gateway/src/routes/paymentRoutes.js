const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/payment', async (req, res) => {
    try {
        const response = await axios.post('http://payment-service:3001/payment', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;