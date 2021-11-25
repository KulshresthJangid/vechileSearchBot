const mongoose = require('mongoose')
const CompanyName = require('./companyNameSchema')

const modelInfoSchema = new mongoose.Schema({
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyName'
    },
    modelName: {
        type: String
    },
    type: {
        type: String,
        default: "Info not available"
    }
})

module.exports = mongoose.model('ModelInfo', modelInfoSchema)