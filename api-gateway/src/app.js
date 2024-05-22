const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', orderRoutes);

app.listen(3003, () => {
    console.log('API Gateway running on port 3003');
});