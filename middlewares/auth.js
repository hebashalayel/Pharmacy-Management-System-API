const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { readFileSync } = require('fs');
const TokenBlacklist = require('../models/TokenBlacklist');

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, 'Invalid token format'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const isBlacklisted = await TokenBlacklist.isBlacklisted(token);
        if (isBlacklisted) {
            return next(createError(401, 'Token revoked'));
        }
        const secretKey = process.env.JWT_SECRET || readFileSync('./configurations/private.key');
        const decoded = jwt.verify(token, secretKey);
        req.user = {
            _id: decoded._id,
            isAdmin: decoded.isAdmin
        };
        next();
    } catch (err) {
        next(createError(401, 'Invalid/expired token'));
    }
};