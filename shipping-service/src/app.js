const express = require('express');
const bodyParser = require('body-parser');
const { processShipment } = require('./services/shipping_processing');

const app = express();
app.use(bodyParser.json());

app.post('/shipment', async (req, res) => {
    try {
        const shipmentId = await processShipment(req.body);
        res.status(201).json({ shipmentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3002, () => {
    console.log('Shipping service running on port 3002');
});