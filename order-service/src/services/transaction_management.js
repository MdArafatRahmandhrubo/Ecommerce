const client = require('../database');

async function placeOrder(order) {
    try {
        await client.connect();
        await client.query('BEGIN');
        const insertOrderQuery = 'INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING id';
        const res = await client.query(insertOrderQuery, [order.user_id, order.total_amount, 'pending']);
        const orderId = res.rows[0].id;

        // Update inventory as part of the transaction
        for (const item of order.items) {
            const updateInventoryQuery = 'UPDATE inventory SET quantity = quantity - $1 WHERE id = $2';
            await client.query(updateInventoryQuery, [item.quantity, item.product_id]);
        }

        await client.query('COMMIT');
        return orderId;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        await client.end();
    }
}

module.exports = { placeOrder };