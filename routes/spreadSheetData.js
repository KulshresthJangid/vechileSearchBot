const express = require('express')
const mongoose = require('mongoose')
const ModelInfo = require('../models/modelInfoSchema')
const CompanyName = require('../models/companyNameSchema')
const Question = require('../models/questions')
const UserResponse = require('../models/questions')
const { getCompanyNameObjectId, getAllCompaniesNames, getAllModelNames, deleteVechileInfo, getAllTypeNames, deleteQuestions, deleteCompanyByName } = require('../utils/utils')
const router = express.Router()

router.get('/', (req, res) => {
    res.send({
        message: "request is working"
    })
})

router.post('/spreadSheetData', async (req, res) => {
    let sheet_name = req.body.sheet_name
    console.log(sheet_name)
    let content = req.body.data
    let rowName = content[0][0]
    content.shift()   
    try {
        let companiesNames = await getAllCompaniesNames()
        let modelNames = await getAllModelNames()
        let typeNames = await getAllTypeNames() 
        for (let index = 0; index < content.length; index++) {
            await deleteVechileInfo(companiesNames[index], modelNames[index], typeNames[index])
            await deleteCompanyByName(content[index][0])
        }
        for (let index = 0; index < content.length; index++) {
            const details = new ModelInfo()
            const companyNameDetails = new CompanyName()
            companyNameDetails.name = content[index][0]
            details.manufacturer = content[index][0]
            details.modelName = content[index][1]
            details.type = content[index][2]
            await details.save()
            await companyNameDetails.save(function (err, data) {
                if (err) {
                    console.log("Error while saving the company name.",err)
                }
            })
        }
        for (let index = 0; index < content.length; index++) {
            await deleteQuestions(content[index][3])
        }
        for (let index = 0; index < content.length; index++) {
            const questions = new Question()
            questions.message = content[index][3]
            questions.type = content[index][4]
            questions.wrongDataError = content[index][5]
            let message = questions.message
            let type = questions.type
            // let wrong = questions.wrongDataError
            if (message.length != 0 && type.length != 0) {
               await questions.save()
            }
            console.log("")
        }
        res.status(200).send({
            error: false,
            message: "Data saved Successfully"
        })

    } catch (e) {
        res.status(400).send({
            error: true,
            message: e.message
        })
        console.log("Error while saving the spreadsheet data", e)
    }
})

module.exports = router