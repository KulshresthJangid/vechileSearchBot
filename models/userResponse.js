const mongoose = require('mongoose')

const userResponseSchema = new mongoose.Schema({
    phoneNumber: {
        type: String
    },
    currentQuestionAsked: {
        type: Number
    },
    selectedManufacturer: {
        type: String
    }, 
    selectedModelName: {
        type: String
    },
    selectedModelType: {
        type: String
    }
})

module.exports = mongoose.model('UserResponse', userResponseSchema)