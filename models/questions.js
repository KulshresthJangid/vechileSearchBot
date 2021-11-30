const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    message: {
        type: String
    },
    type: {
        type: String
    },
    wrongDataError: {
        type: String
    }
})
module.exports = mongoose.model('Question', questionSchema)