const { placeOrder } = require('../src/services/transaction_management');
const client = require('../src/database');

jest.mock('../src/database', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return mClient;
});

describe('Transaction Management', () => {
    beforeEach(() => {
        client.connect.mockClear();
        client.query.mockClear();
        client.end.mockClear();
    });

    it('should place an order and update inventory', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({});

        const order = { user_id: 1, total_amount: 100, items: [{ product_id: 1, quantity: 1 }] };
        const orderId = await placeOrder(order);

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING id',
            [1, 100, 'pending']
        );
        expect(client.query).toHaveBeenCalledWith(
            'UPDATE inventory SET quantity = quantity - $1 WHERE id = $2',
            [1, 1]
        );
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(orderId).toBe(1);
    });

    it('should rollback transaction if error occurs', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockRejectedValueOnce(new Error('Update inventory failed'));

        const order = { user_id: 1, total_amount: 100, items: [{ product_id: 1, quantity: 1 }] };

        await expect(placeOrder(order)).rejects.toThrow('Update inventory failed');

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING id',
            [1, 100, 'pending']
        );
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });
});