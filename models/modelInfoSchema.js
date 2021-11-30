const mongoose = require('mongoose')

const modelInfoSchema = new mongoose.Schema({
    manufacturer: {
        type: String
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