const AlternativeMedicine = require('../models/alternativeMedicine');

const getAlternativeMedicinesByPrimary = (req, res, next) => {
    AlternativeMedicine.getAlternativeMedicinesByPrimary(req.params.primaryId)
        .then(alternatives => returnJson(res, 200, true, 'Alternative medicines retrieved successfully', alternatives))
        .catch(err => next(err));
};
const addAlternative = (req, res, next) => {
    AlternativeMedicine.add(req.body)
        .then(result => returnJson(res, 201, true, 'Alternative medicine added successfully', null))
        .catch(err => next(err));
};

const updateAlternative = (req, res, next) => {
    AlternativeMedicine.update(req.params.id, req.body)
        .then(result => returnJson(res, 200, true, 'Alternative medicine updated successfully', null))
        .catch(err => next(err));
};

const deleteAlternative = (req, res, next) => {
    AlternativeMedicine.delete(req.params.id)
        .then(result => returnJson(res, 200, true, 'Alternative medicine deleted successfully', null))
        .catch(err => next(err));
};

module.exports = {
    getAlternativeMedicinesByPrimary,
    addAlternative,
    updateAlternative,
    deleteAlternative
};



