const PrimaryMedicine = require('../models/primaryMedicine');

const getPrimaryMedicines = (req, res, next) => {
    PrimaryMedicine.getAll()
        .then(medicines => returnJson(res, 200, true, 'Primary medicines retrieved successfully', medicines))
        .catch(err => next(err));
};

const getPrimaryMedicineById = (req, res, next) => {
    PrimaryMedicine.getById(req.params.id)
        .then(medicine => returnJson(res, 200, true, 'Primary medicine retrieved successfully', medicine))
        .catch(err => next(err));
};

const addPrimaryMedicine = (req, res, next) => {
    PrimaryMedicine.add(req.body)
        .then(result => returnJson(res, 201, true, 'Primary medicine added successfully', null))
        .catch(err => next(err));
};

const updatePrimaryMedicine = (req, res, next) => {
    PrimaryMedicine.update(req.params.id, req.body)
        .then(result => returnJson(res, 200, true, 'Primary medicine updated successfully', null))
        .catch(err => next(err));
};

const deletePrimaryMedicine = (req, res, next) => {
    PrimaryMedicine.delete(req.params.id)
        .then(result => returnJson(res, 200, true, 'Primary medicine deleted successfully', null))
        .catch(err => next(err));
};

module.exports = {
    getPrimaryMedicines,
    getPrimaryMedicineById,
    addPrimaryMedicine,
    updatePrimaryMedicine,
    deletePrimaryMedicine

};



