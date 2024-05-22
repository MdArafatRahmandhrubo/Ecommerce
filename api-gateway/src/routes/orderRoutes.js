const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user_id
 *         - items
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The ID of the user placing the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *       example:
 *         user_id: 1
 *         items:
 *           - product_id: 101
 *             quantity: 2
 *     Payment:
 *       type: object
 *       required:
 *         - order_id
 *         - amount
 *       properties:
 *         order_id:
 *           type: integer
 *           description: The ID of the order
 *         amount:
 *           type: number
 *           description: The amount to be paid
 *       example:
 *         order_id: 1
 *         amount: 100.50
 *     Shipment:
 *       type: object
 *       required:
 *         - order_id
 *         - address
 *       properties:
 *         order_id:
 *           type: integer
 *           description: The ID of the order
 *         address:
 *           type: string
 *           description: The shipping address
 *       example:
 *         order_id: 1
 *         address: "123 Main St, Anytown, USA"
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       500:
 *         description: Some server error
 */
router.post('/order', async (req, res) => {
    try {
        const response = await axios.post('http://order-service:3000/order', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Make a payment
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       500:
 *         description: Some server error
 */
router.post('/payment', async (req, res) => {
    try {
        const response = await axios.post('http://payment-service:3001/payment', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/shipment:
 *   post:
 *     summary: Create a shipment
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipment'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       500:
 *         description: Some server error
 */
router.post('/shipment', async (req, res) => {
    try {
        const response = await axios.post('http://shipping-service:3002/shipment', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
