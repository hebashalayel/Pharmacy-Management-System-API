const { Router } = require('express');
const { pharmacyController } = require('../controllers');
const { auth } = require('../middlewares');
const createError = require('http-errors');
const router = Router();

const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) return next(createError(403, 'Admin only'));
    next();
};

router.use(auth, isAdmin);

router.get('/', pharmacyController.getPharmacies)
    .get('/pages', pharmacyController.getPharmaciesPageCount)
    .get('/:id', pharmacyController.getPharmacyById)
    .post('/', pharmacyController.addPharmacy)
    .put('/:id', pharmacyController.updatePharmacy)
    .delete('/:id', pharmacyController.deletePharmacy);

module.exports = router;