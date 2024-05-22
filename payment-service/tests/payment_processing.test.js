const { processPayment } = require('../src/services/payment_processing');
const client = require('../src/database');

jest.mock('../src/database', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return mClient;
});

describe('Payment Processing', () => {
    beforeEach(() => {
        client.connect.mockClear();
        client.query.mockClear();
        client.end.mockClear();
    });

    it('should process a payment successfully', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({});

        const payment = { order_id: 1, amount: 100 };
        const paymentId = await processPayment(payment);

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO payments(order_id, amount, status) VALUES($1, $2, $3) RETURNING id',
            [1, 100, 'completed']
        );
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(paymentId).toBe(1);
    });

    it('should rollback payment if error occurs', async () => {
        client.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockRejectedValueOnce(new Error('Payment processing failed'));

        const payment = { order_id: 1, amount: 100 };

        await expect(processPayment(payment)).rejects.toThrow('Payment processing failed');

        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalledTimes(3);
        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith(
            'INSERT INTO payments(order_id, amount, status) VALUES($1, $2, $3) RETURNING id',
            [1, 100, 'completed']
        );
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });
});