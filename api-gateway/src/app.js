const express = require('express');
const bodyParser = require('body-parser');
const { swaggerUi, specs } = require('../../swagger');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(bodyParser.json());

// Apply Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Example route
app.use('/api', orderRoutes);

app.listen(3003, () => {
    console.log('API Gateway running on port 3003');
});
