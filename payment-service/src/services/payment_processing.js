const client = require('../database');

async function processPayment(payment) {
    try {
        await client.connect();
        await client.query('BEGIN');
        const insertPaymentQuery = 'INSERT INTO payments(order_id, amount, status) VALUES($1, $2, $3) RETURNING id';
        const res = await client.query(insertPaymentQuery, [payment.order_id, payment.amount, 'completed']);
        const paymentId = res.rows[0].id;
        await client.query('COMMIT');
        return paymentId;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        await client.end();
    }
}

module.exports = { processPayment };