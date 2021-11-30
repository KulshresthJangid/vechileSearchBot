const express = require("express");
const mongoose = require("mongoose");
const ModelInfo = require("../models/modelInfoSchema");
const Question = require("../models/questions");
const UserResponse = require("../models/userResponse");
const {
  getCompanyNameObjectId,
  deleteVechileInfo,
  getAllCompaniesNames,
  getAllModelNames,
  getAllTypeNames,
  deleteQuestions,
  sendFirstQuestion,
  allCompaniesListWithIndex,
  selectedCompany,
  saveUserSelectedCompany,
  companyModelNames,
  currentUser,
  findQuestion,
  updateCurrentQuestionAsked,
  allModelListWithIndex,
  deleteUser,
  getAllModelTypesByModelName,
  getAllModelTypesByModelNameWithIndex,
  getUserSelectedManufacturer,
  saveUserSelectedModelName
} = require("../utils/utils");
const router = express.Router();

router.post("/webhook", async (req, res) => {
  let message = req.body.message
  let phoneNumber = req.body.phoneNumber
  if (message === "HII" || message === "hii") {
    let firstQuestion = await sendFirstQuestion();
    let menu = await allCompaniesListWithIndex();
    let userResponse = new UserResponse()
    // for (let i = 0; i < menu.length; i++) {
    //   str = str.concat(menu[i], "/n");
    // }
    userResponse.phoneNumber = phoneNumber
    userResponse.currentQuestionAsked = 1
    userResponse.selectedManufacturer = ''
    userResponse.selectedModelName = ''
    userResponse.selectedModelType = ''
    await userResponse.save()
    res.send(firstQuestion + '\n' +menu.join("\n"));
  }
  else if(message === "*") {
    await deleteUser(phoneNumber)
    console.log("User deleted trigerred")
    res.send("Welcome, Please say HII to continue")
  }
  else if(!isNaN(message)) {
    let allCompanies = await getAllCompaniesNames()
    console.log("------------ HERE is the all companuie")
    let selectedCompany = allCompanies[message]
    await saveUserSelectedCompany(phoneNumber, selectedCompany)
    let user = await currentUser(phoneNumber)
    switch (user[0].currentQuestionAsked) {
      case 1:
        let listOfModelNames = await companyModelNames(selectedCompany)
        let selectedOption = allCompanies[message]
        let question = await findQuestion('askModelName')
        let menu = await allModelListWithIndex(selectedOption)
        let nextQuestion = question.message
        console.log("Here is list of all the available models", menu)
        await updateCurrentQuestionAsked(phoneNumber, 2)
        res.send(nextQuestion + '\n' + menu.join('\n'))
        break;
      case 2: 
        let allCompany = await getAllCompaniesNames()
        let selectedCompany = await getUserSelectedManufacturer(phoneNumber)
        let a = await getAllModelTypesByModelName(selectedCompany[0])
        let menu2 = await getAllModelTypesByModelNameWithIndex(selectedCompany[0])
        res.send(a)

        // let allCompany = await getAllCompaniesNames()
        // let selectedCompany = await getUserSelectedManufacturer(phoneNumber)
        // menu = await getAllModelTypesByModelNameWithIndex(selectedCompany[0])
        // nextQuestion = await findQuestion('askModelType')
        // await updateCurrentQuestionAsked(phoneNumber, 3)
        // await saveUserSelectedModelName(phoneNumber, menu[message])
        // res.send(nextQuestion + '\n' + menu.join('\n'))
        
        break;
        


    
      default:
        break;
    }

    
  }
});

module.exports = router;
