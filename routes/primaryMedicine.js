const { Router } = require('express');
const { primaryMedicineController } = require('../controllers');
const { auth } = require('../middlewares');
const createError = require('http-errors');
const router = Router();

const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) return next(createError(403, 'Admin only'));
    next();
};

router.use(auth, isAdmin);

router.get('/', primaryMedicineController.getPrimaryMedicines)
    .get('/:id', primaryMedicineController.getPrimaryMedicineById)
    .post('/', primaryMedicineController.addPrimaryMedicine)
    .put('/:id', primaryMedicineController.updatePrimaryMedicine)
    .delete('/:id', primaryMedicineController.deletePrimaryMedicine);
module.exports = router;
