const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const TokenBlacklist = require('../models/TokenBlacklist');
const signup = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        returnJson(res, 201, true, 'User created successfully',null);
    } catch (err) {
        next(err);  
    }
}; 
const login = async (req, res, next) => {
    try {
        const result = await User.login(req.body);
        if (!result.status) {
            throw createError(result.code, result.message);
        }

        const secretKey = process.env.JWT_SECRET || readFileSync('./configurations/private.key');
        const token = jwt.sign(
            {
                _id: result.data._id,
                isAdmin: result.data.isAdmin
            },
            secretKey,
            { expiresIn: '1h' }
        );

        returnJson(res, 200, true, 'Login successful', { token, isAdmin: result.data.isAdmin });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.get('Authorization').split(' ')[1];
        await TokenBlacklist.add(token);
        returnJson(res, 200, true, 'Logged out successfully',null);
    } catch (err) {
        next(createError(500, 'Logout failed'));
    }
};
module.exports = { signup, login, logout };


















