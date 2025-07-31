const Pharmacy = require('../models/pharmacy');

const getPharmacies = (req, res, next) => {
    const pageNumber = parseInt(req.query.page);

    Pharmacy.getPharmacies(pageNumber)
        .then(pharmacies => returnJson(res, 200, true, 'Pharmacies retrieved successfully', pharmacies))
        .catch(err => next(err));
};

const getPharmaciesPageCount = (req, res, next) => {
    Pharmacy.getPharmaciesPageCount()
        .then(result => returnJson(res, 200, true, 'Page count retrieved successfully', result))
        .catch(err => next(err));
};

const getPharmacyById = (req, res, next) => {
    const id = req.params.id;

    Pharmacy.getPharmacyById(id)
        .then(pharmacy => returnJson(res, 200, true, 'Pharmacy retrieved successfully', pharmacy))
        .catch(err => next(err));
};

const addPharmacy = (req, res, next) => {
    const pharmacyData = req.body;

    Pharmacy.add(pharmacyData)
        .then(result => returnJson(res, 201, true, 'Pharmacy added successfully', null))
        .catch(err => next(err));
};

const updatePharmacy = (req, res, next) => {
    const id = req.params.id;
    const updateData = req.body;

    Pharmacy.update(id, updateData)
        .then(result => returnJson(res, 200, true, 'Pharmacy updated successfully', null))
        .catch(err => next(err));
};

const deletePharmacy = (req, res, next) => {
    const id = req.params.id;

    Pharmacy.delete(id)
        .then(result => returnJson(res, 200, true, 'Pharmacy deleted successfully', null))
        .catch(err => next(err));
};

module.exports = {
    getPharmacies,
    getPharmaciesPageCount,
    getPharmacyById,
    addPharmacy,
    updatePharmacy,
    deletePharmacy
};