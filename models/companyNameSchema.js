const mongoose = require('mongoose')

const companyNameSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

module.exports = mongoose.model('CompanyName', companyNameSchema)