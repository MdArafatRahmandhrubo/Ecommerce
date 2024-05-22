const client = require('../database');

async function processShipment(shipment) {
    try {
        await client.connect();
        await client.query('BEGIN');
        const insertShipmentQuery = 'INSERT INTO shipments(order_id, tracking_number, status) VALUES($1, $2, $3) RETURNING id';
        const res = await client.query(insertShipmentQuery, [shipment.order_id, shipment.tracking_number, 'shipped']);
        const shipmentId = res.rows[0].id;
        await client.query('COMMIT');
        return shipmentId;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        await client.end();
    }
}

module.exports = { processShipment };