const returnJson = (res,statuseCode,status,message,data) => {
    return res.status(statuseCode).json(
        {
            status: {
                status: status,
                message:message
            },
            data:data
        }
    )
}
module.exports={returnJson}