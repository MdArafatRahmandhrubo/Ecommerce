const client = require('../database');

async function manageShipping(shipping) {
    try {
        await client.connect();
        await client.query('BEGIN');
        const insertShippingQuery = 'INSERT INTO shippings(order_id, address, status) VALUES($1, $2, $3) RETURNING id';
        const res = await client.query(insertShippingQuery, [shipping.order_id, shipping.address, 'shipped']);
        const shippingId = res.rows[0].id;
        await client.query('COMMIT');
        return shippingId;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        await client.end();
    }
}

module.exports = { manageShipping };