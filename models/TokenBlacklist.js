const { dbConnection } = require('../configurations');

class TokenBlacklist {
    static add(token) {
        return new Promise((resolve, reject) => {
            dbConnection('blacklisted_tokens', async (collection) => {
                try {
                    await collection.insertOne({ token, expiresAt: new Date(Date.now() + 3600 * 1000) }); // Expires in 1h
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static isBlacklisted(token) {
        return new Promise((resolve, reject) => {
            dbConnection('blacklisted_tokens', async (collection) => {
                try {
                    const found = await collection.findOne({ token });
                    resolve(!!found);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = TokenBlacklist;