const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many requests from this IP, please try again after a minute',
    headers: true,
    keyGenerator: (req) => req.headers['api-key'] || req.ip,
});

module.exports = apiLimiter;