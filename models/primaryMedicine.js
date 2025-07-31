const { dbConnection } = require('../configurations');
const { ObjectId } = require('bson');
const createError = require('http-errors');

class PrimaryMedicine {
    static add(data) {
        return new Promise((resolve, reject) => {
            dbConnection('primary_medicines', async (collection) => {
                try {
                    await collection.insertOne(data);
                    resolve({ status: true, message: "Primary medicine added." });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) return reject(createError(400, "Invalid ID"));
            dbConnection('primary_medicines', async (collection) => {
                try {
                    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
                    if (result.matchedCount === 0) return reject(createError(404, "Medicine not found"));
                    resolve({ status: true, message: "Primary medicine updated." });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) return reject(createError(400, "Invalid ID"));
            dbConnection('primary_medicines', async (collection) => {
                try {
                    const result = await collection.deleteOne({ _id: new ObjectId(id) });
                    if (result.deletedCount === 0) return reject(createError(404, "Medicine not found"));
                    resolve({ status: true, message: "Primary medicine deleted." });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            dbConnection('primary_medicines', async (collection) => {
                try {
                    const result = await collection.find({}).toArray();
                    resolve(result);
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) return reject(createError(400, "Invalid ID"));
            dbConnection('primary_medicines', async (collection) => {
                try {
                    const medicine = await collection.findOne({ _id: new ObjectId(id) });
                    if (!medicine) return reject(createError(404, "Medicine not found"));
                    resolve(medicine);
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }
}
module.exports = PrimaryMedicine;
