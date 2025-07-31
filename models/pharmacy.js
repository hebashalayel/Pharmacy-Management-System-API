const { dbConnection } = require('../configurations');
const { ObjectId } = require('bson');
const createError = require('http-errors');

class Pharmacy {
    static add(pharmacyData) {
        return new Promise((resolve, reject) => {
            dbConnection('pharmacies', async (collection) => {
                try {
                    await collection.insertOne(pharmacyData);
                    resolve({
                        status: true,
                        message: 'Pharmacy added successfully!'
                    });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static update(id, updateData) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) {
                reject(createError(400, "Invalid ID format"));
                return;
            }
            dbConnection('pharmacies', async (collection) => {
                try {
                    const _id = new ObjectId(id);
                    const result = await collection.updateOne(
                        { _id },
                        { $set: updateData }
                    );
                    if (result.matchedCount === 0) {
                        reject(createError(404, "Pharmacy not found"));
                    } else {
                        resolve({
                            status: true,
                            message: 'Pharmacy updated successfully!'
                        });
                    }
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) {
                reject(createError(400, "Invalid ID format"));
                return;
            }
            dbConnection('pharmacies', async (collection) => {
                try {
                    const _id = new ObjectId(id);
                    const result = await collection.deleteOne({ _id });
                    if (result.deletedCount === 0) {
                        reject(createError(404, "Pharmacy not found"));
                    } else {
                        resolve({
                            status: true,
                            message: 'Pharmacy deleted successfully!'
                        });
                    }
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getPharmacyById(id) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) {
                reject(createError(400, "Invalid ID format"));
                return;
            }
            const _id = new ObjectId(id);
            dbConnection('pharmacies', async (collection) => {
                try {
                    const pharmacy = await collection.findOne({ _id });
                    if (!pharmacy) {
                        reject(createError(404, "Pharmacy not found"));
                    } else {
                        resolve(pharmacy);
                    }
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getPharmacies(pageNumber) {
        return new Promise((resolve, reject) => {
            if (isNaN(pageNumber)) {
                reject(createError(400, "Page number must be numeric"));
                return;
            }
            const limit = 10;
            const skip = (pageNumber - 1) * limit;
            dbConnection('pharmacies', async (collection) => {
                try {
                    const pharmacies = await collection.find({})
                        .limit(limit)
                        .skip(skip)
                        .toArray();
                    resolve(pharmacies);
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getPharmaciesPageCount() {
        return new Promise((resolve, reject) => {
            dbConnection('pharmacies', async (collection) => {
                try {
                    const limit = 10;
                    const count = await collection.countDocuments({});
                    const pages = Math.ceil(count / limit);
                    resolve({ pages });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }
}

module.exports = Pharmacy;