const { dbConnection } = require('../configurations');
const { hashSync, compareSync } = require('bcryptjs');
const createError = require('http-errors');

class User {
    constructor(userData) {
        this.userData = userData;
        this.userData.isAdmin = false;
    }

    save(cb) {
        dbConnection('users', async (collection) => {
            try {
                const hashedPassword = hashSync(this.userData.password);
                this.userData.password = hashedPassword;
                await collection.insertOne(this.userData);
                cb({ status: true });
            } catch (err) {
                cb({ status: false, message: err.message });
            }
        });
    }

    static login(loginData) {
        return new Promise((resolve, reject) => {
            dbConnection('users', async (collection) => {
                try {
                    const user = await collection.findOne({
                        username: loginData.username
                    });

                    if (!user || !compareSync(loginData.password, user.password)) {
                        resolve({
                            status: false,
                            code: 401,
                            message: 'Invalid credentials'
                        });
                        return;
                    }

                    resolve({
                        status: true,
                        data: {
                            _id: user._id,
                            isAdmin: user.isAdmin 
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = User;