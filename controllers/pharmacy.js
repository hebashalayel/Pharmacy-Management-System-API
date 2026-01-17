const Pharmacy = require('../models/pharmacy');
const { body, param, validationResult } = require('express-validator');

const getPharmacies = (req, res, next) => {
    const pageNumber = parseInt(req.query.page);
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
    }

    Pharmacy.getPharmacies(pageNumber)
        .then(pharmacies => returnJson(res, 200, true, 'Pharmacies retrieved successfully', pharmacies))
        .catch(err => next(err));
};

const getPharmaciesPageCount = (req, res, next) => {
    Pharmacy.getPharmaciesPageCount()
        .then(result => returnJson(res, 200, true, 'Page count retrieved successfully', result))
        .catch(err => next(err));
};

const getPharmacyById = [
    param('id').isMongoId().withMessage('Invalid pharmacy ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;

        Pharmacy.getPharmacyById(id)
            .then(pharmacy => returnJson(res, 200, true, 'Pharmacy retrieved successfully', pharmacy))
            .catch(err => next(err));
    }
];

const addPharmacy = [
    body('name').notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pharmacyData = req.body;

        Pharmacy.add(pharmacyData)
            .then(result => returnJson(res, 201, true, 'Pharmacy added successfully', null))
            .catch(err => next(err));
    }
];

const updatePharmacy = [
    param('id').isMongoId().withMessage('Invalid pharmacy ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const updateData = req.body;

        Pharmacy.update(id, updateData)
            .then(result => returnJson(res, 200, true, 'Pharmacy updated successfully', null))
            .catch(err => next(err));
    }
];

const deletePharmacy = [
    param('id').isMongoId().withMessage('Invalid pharmacy ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;

        Pharmacy.delete(id)
            .then(result => returnJson(res, 200, true, 'Pharmacy deleted successfully', null))
            .catch(err => next(err));
    }
];

module.exports = {
    getPharmacies,
    getPharmaciesPageCount,
    getPharmacyById,
    addPharmacy,
    updatePharmacy,
    deletePharmacy
};