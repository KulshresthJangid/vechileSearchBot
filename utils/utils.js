const mongoose = require('mongoose')
const CompanyName = require('../models/companyNameSchema')
const ModelInfo = require('../models/modelInfoSchema')
const Questions = require('../models/questions')


async function getCompanyNameObjectId(name) {
    return new Promise((resolve, reject) => {
        CompanyName.find({ name: name }, function (err, data) {
            if(err) {
                console.log("Unexpected Error", err)
                reject(err)
            } else {
                let ObjectId = data[0]._id
                console.log(`Object Id of ${name}`, ObjectId)
                resolve(ObjectId)
            }
        })
    })
}

async function deleteCompanyName(name) {
    return new Promise((resolve, reject) => {
        CompanyName.deleteOne({ name: name }, function (err, data) {
            if (err) {
                console.log("Error while deleting the Company Name", err)
                reject(err)
            } else {
                console.log("Company Deleted", data)
                resolve(data)
            }
        })
    })
}

async function getAllCompanies() {
    return new Promise((resolve, reject) => {
        CompanyName.find({}, {name: 1, _id: 0}, function (err, data) {
            if (err) {
                console.log("Error while getting the company name", err)
                reject(err)
            } else {
                console.log(data.map(value => value.name))
                resolve(data.map(value => value.name))
            }
        })
    })
}

module.exports = {
    getCompanyNameObjectId,
    deleteCompanyName
}