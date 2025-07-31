const pharmacyRouter = require('./pharmacy')
const authRouter = require('./auth')
const primaryMidicineRouter = require('./primaryMedicine')
const alternativeMedicineRouter=require('./alternativeMedicine')
module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.status(200).json({
            status: true,
            message:null,
        })
    })
    app.use('/pharmacy', pharmacyRouter)
    app.use('/auth', authRouter)
    app.use('/primaryMedicine', primaryMidicineRouter)
    app.use('/alternativeMedicine', alternativeMedicineRouter)
    
}