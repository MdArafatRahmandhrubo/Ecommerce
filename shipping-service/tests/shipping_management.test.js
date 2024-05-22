const { manageShipping } = require('../src/services/shipping_management');
const client = require('../src/database');

jest.mock('../src/database', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return mClient;
});

describe('Shipping Management', () => {
    beforeEach(() => {
        client.connect.mockClear();
        client.query.mockClear();
        client.end.mockClear();
    });

    it('should manage shipping successfully', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({});

        const shipping = { order_id: 1, address: '123 Main St' };
        const shippingId = await manageShipping(shipping);

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO shippings(order_id, address, status) VALUES($1, $2, $3) RETURNING id',
            [1, '123 Main St', 'shipped']
        );
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(shippingId).toBe(1);
    });

    it('should rollback shipping if error occurs', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockRejectedValueOnce(new Error('Shipping management failed'));

        const shipping = { order_id: 1, address: '123 Main St' };

        await expect(manageShipping(shipping)).rejects.toThrow('Shipping management failed');

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO shippings(order_id, address, status) VALUES($1, $2, $3) RETURNING id',
            [1, '123 Main St', 'shipped']
        );
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });
});