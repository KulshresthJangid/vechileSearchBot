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
  saveUserSelectedModelName,
  getUserSelectedModelName,
  saveUserSelectedModelType,
  getUserSelectedModelType
} = require("../utils/utils");
const router = express.Router();

router.post("/webhook", async (req, res) => {
  let message = req.body.message
  let phoneNumber = req.body.phoneNumber
  let returnToMainMenu = await findQuestion('returnToMainMenu')
  let temp = returnToMainMenu.message
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
    res.send(firstQuestion + '\n' +menu.join("\n") + '\n' + temp);
  }
  else if(message === "*") {
    await deleteUser(phoneNumber)
    console.log("User deleted trigerred")
    res.send("Welcome, Please say HII to continue")
  }
  else if(!isNaN(message)) {
    let allCompanies = await getAllCompaniesNames()
    console.log("------------ HERE is the all companies", allCompanies)
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
        res.send(nextQuestion + '\n' + menu.join('\n') + '\n' + temp)
        break;
      case 2: 
        let allComp = await getAllCompaniesNames()
        let userSelectedComp = await getUserSelectedManufacturer(phoneNumber)
        let listOfModelNamesTwo = await companyModelNames(userSelectedComp[0])
        let selectedOptionTwo = listOfModelNamesTwo[message]
        console.log("------------------", selectedOptionTwo)
        // user the userSelectedComp[0] to get access the userSelectedComp
        let secondMenu = await getAllModelTypesByModelNameWithIndex(selectedOptionTwo)
        let questionTwo = await findQuestion('askModelType')
        let nextQuestionTwo = questionTwo.message
        await updateCurrentQuestionAsked(phoneNumber, 3)
        await saveUserSelectedModelName(phoneNumber, selectedOptionTwo)
        res.send(nextQuestionTwo + '\n' + secondMenu.join('\n') + '\n' + temp)

        // let allCompany = await getAllCompaniesNames()
        // let selectedCompany = await getUserSelectedManufacturer(phoneNumber)
        // menu = await getAllModelTypesByModelNameWithIndex(selectedCompany[0])
        // nextQuestion = await findQuestion('askModelType')
        // await updateCurrentQuestionAsked(phoneNumber, 3)
        // await saveUserSelectedModelName(phoneNumber, menu[message])
        // res.send(nextQuestion + '\n' + menu.join('\n'))
        
        break;
        case 3: 
          let userSelectedModelName = await getUserSelectedModelName(phoneNumber) 
          let selectedModelType = await getAllModelTypesByModelName(userSelectedModelName)
          await saveUserSelectedModelType(phoneNumber, selectedModelType[0])
          let userSelectedModelType = await getUserSelectedModelType(phoneNumber)
          console.log('-------------userSelectedModelType', userSelectedModelType)
          let userSelectedManufacturer = await getUserSelectedManufacturer(phoneNumber)
          
          
          res.send("Thank you for you time here is the details that you have choosen" + '\n' + "Vechile Manufacturer: " + userSelectedManufacturer + '\n' + "Vechile Model Name: " + userSelectedModelName + '\n' + "Vechile Model Type: " + userSelectedModelType)
          break;


    
      default:
        break;
    }

    
  }
});

module.exports = router;
