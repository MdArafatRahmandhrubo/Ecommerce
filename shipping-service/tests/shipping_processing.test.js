const { processShipment } = require('../src/services/shipping_processing');
const client = require('../src/database');

jest.mock('../src/database', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return mClient;
});

describe('Shipping Processing', () => {
    beforeEach(() => {
        client.connect.mockClear();
        client.query.mockClear();
        client.end.mockClear();
    });

    it('should process a shipment successfully', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({});

        const shipment = { order_id: 1, tracking_number: '12345ABC' };
        const shipmentId = await processShipment(shipment);

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO shipments(order_id, tracking_number, status) VALUES($1, $2, $3) RETURNING id',
            [1, '12345ABC', 'shipped']
        );
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(shipmentId).toBe(1);
    });

    it('should rollback shipment if error occurs', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockRejectedValueOnce(new Error('Shipping processing failed'));

        const shipment = { order_id: 1, tracking_number: '12345ABC' };

        await expect(processShipment(shipment)).rejects.toThrow('Shipping processing failed');

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO shipments(order_id, tracking_number, status) VALUES($1, $2, $3) RETURNING id',
            [1, '12345ABC', 'shipped']
        );
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });
});