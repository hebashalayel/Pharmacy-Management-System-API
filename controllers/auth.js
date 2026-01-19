const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { readFile } = require('fs').promises;
const TokenBlacklist = require('../models/TokenBlacklist');
const signup = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        returnJson(res, 201, true, 'User created successfully',null);
    } catch (err) {
        next(new Error('User creation failed'));  
    }
}; 

const login = async (req, res, next) => {
    try {
        const result = await User.login(req.body);
        if (!result.status) {
            throw createError(result.code, result.message);
        }

        const secretKey = process.env.JWT_SECRET || await readFile('./configurations/private.key', 'utf8');
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
        next(new Error('Login failed'));
    }
};

const logout = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            return next(new Error('Authorization header missing')); 
        }
        const token = authHeader.split(' ')[1];
        await TokenBlacklist.add(token);
        returnJson(res, 200, true, 'Logged out successfully',null);
    } catch (err) {
        next(new Error('Logout failed'));
    }
};
module.exports = { signup, login, logout };