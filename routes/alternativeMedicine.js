const { Router } = require('express');
const { alternativeMedicineController } = require('../controllers');
const { auth } = require('../middlewares');
const createError = require('http-errors');
const router = Router();

const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) return next(createError(403, 'Admin only'));
    next();
};

router.use(auth, isAdmin);

router.get('/by-primary/:primaryId', alternativeMedicineController.getAlternativeMedicinesByPrimary)
    .post('/', alternativeMedicineController.addAlternative)
    .put('/:id', alternativeMedicineController.updateAlternative)
    .delete('/:id', alternativeMedicineController.deleteAlternative);

module.exports = router;
