const express = require('express')
const mongoose = require('mongoose')
const CompanyName = require('../models/companyNameSchema')
const ModelInfo = require('../models/modelInfoSchema')
const Questions = require('../models/questions')
const UserResponse = require('../models/questions')
const { getCompanyNameObjectId, deleteCompanyName, getAllCompanies } = require('../utils/utils')
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
    console.log(content, sheet_name)
    console.log(content[0][0])
    console.log("Row Name------",rowName)
    switch (rowName) {
        case "company name":
            try {
                let allCompanyLists = await getAllCompanies()
                console.log("----------Hey",allCompanyLists)
                for (let index = 0; index < content.length; index++)  {
                    const details = new CompanyName()
                    details.name = content[index][0]
                    let character = details.name
                    if (characterLength != 0) {
                        details.save().then(() => {
                            res.send({
                                message: "Your data saved successfully",
                                error: false
                            })
                            console.log("Data saved successfully")
                        })
                    } else {
                        console.log("empty string")
                    }                 
                }
            } catch (e) {
                res.status(400).send({
                    error: true,
                    message: e.message
                })
            }
            break;
        case "model name": 
            try {
                for (let index = 0; index < content.length; index++) {
                    const details = new ModelInfo()
                    
                    details.modelName = content[index][1]
                    details.type = content[index][2]

                    
                }
            } catch (e) {
                res.status(400).send({
                    error: true,
                    message: e.message
                })
            }
    
        default:
            break;
    }
})

module.exports = router