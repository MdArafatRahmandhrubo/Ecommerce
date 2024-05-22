const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/shipping', async (req, res) => {
    try {
        const response = await axios.post('http://shipping-service:3002/shipping', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;