const { dbConnection } = require('../configurations');
const { ObjectId } = require('bson');
const createError = require('http-errors');

class AlternativeMedicine {
    static add(data) {
        return new Promise((resolve, reject) => {
            if (!data.primaryMedicineId || !Array.isArray(data.pharmacyIds)) {
                return reject(createError(400, "Missing primaryMedicineId or pharmacyIds"));
            }

            const primaryId = new ObjectId(data.primaryMedicineId);
            const pharmacyIds = data.pharmacyIds.map(id => new ObjectId(id));

            dbConnection('primary_medicines', async (primaryCollection) => {
                try {
                    const primaryExists = await primaryCollection.findOne({ _id: primaryId });
                    if (!primaryExists) {
                        return reject(createError(404, "Primary medicine not found"));
                    }
                    dbConnection('pharmacies', async (pharmacyCollection) => {
                        try {
                            const foundPharmacies = await pharmacyCollection.find({
                                _id: { $in: pharmacyIds }
                            }).toArray();
                            if (foundPharmacies.length !== pharmacyIds.length) {
                                return reject(createError(404, "One or more pharmacyIds not found"));
                            }
                            dbConnection('alternative_medicines', async (altCollection) => {
                                try {
                                    await altCollection.insertOne({
                                        primaryMedicineId: primaryId,
                                        pharmacyIds: pharmacyIds
                                    });
                                    resolve({ status: true, message: "Alternative added." });
                                } catch (err) {
                                    reject(createError(500, err.message));
                                }
                            });

                        } catch (err) {
                            reject(createError(500, err.message));
                        }
                    });

                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }
    

    static update(id, data) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) return reject(createError(400, "Invalid ID"));
            if (data.primaryMedicineId) data.primaryMedicineId = new ObjectId(data.primaryMedicineId);
            if (data.pharmacyIds) data.pharmacyIds = data.pharmacyIds.map(id => new ObjectId(id));

            dbConnection('alternative_medicines', async (collection) => {
                try {
                    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
                    if (result.matchedCount === 0) return reject(createError(404, "Alternative not found"));
                    resolve({ status: true, message: "Alternative updated." });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(id)) return reject(createError(400, "Invalid ID"));
            dbConnection('alternative_medicines', async (collection) => {
                try {
                    const result = await collection.deleteOne({ _id: new ObjectId(id) });
                    if (result.deletedCount === 0) return reject(createError(404, "Alternative not found"));
                    resolve({ status: true, message: "Alternative deleted." });
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }

    static getAlternativeMedicinesByPrimary(primaryId) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(primaryId)) return reject(createError(400, "Invalid ID"));
            dbConnection('alternative_medicines', async (collection) => {
                try {
                    const results = await collection.aggregate([
                        { $match: { primaryMedicineId: new ObjectId(primaryId) } },
                        {
                            $lookup: {
                                from: 'pharmacies',
                                localField: 'pharmacyIds',
                                foreignField: '_id',
                                as: 'pharmacies'
                            }
                        }
                    ]).toArray();
                    resolve(results);
                } catch (err) {
                    reject(createError(500, err.message));
                }
            });
        });
    }
}

module.exports = AlternativeMedicine;
