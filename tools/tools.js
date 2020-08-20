const {cors} = require('./cors');

function errorHandler(req,res,next){
    return res.json({
        code:500,
        message:'An error occured'
    })
}

module.exports = {cors,errorHandler};