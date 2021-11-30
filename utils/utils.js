const mongoose = require("mongoose");
const CompanyName = require("../models/companyNameSchema");
const ModelInfo = require("../models/modelInfoSchema");
const Question = require("../models/questions");
const UserResponse = require('../models/userResponse')

async function getCompanyNameObjectId(name) {
  return new Promise((resolve, reject) => {
    ModelInfo.find({ name: name }, function (err, data) {
      if (err) {
        console.log("Unexpected Error", err);
        reject(err);
      } else {
        let ObjectId = data[0]._id;
        console.log(`Object Id of ${name}`, ObjectId);
        resolve(ObjectId);
      }
    });
  });
}

async function deleteVechileInfo(name, model, modelType) {
  return new Promise((resolve, reject) => {
    ModelInfo.deleteOne(
      { manufacturer: name, modelName: model, type: modelType },
      function (err, data) {
        if (err) {
          console.log("Error while deleting the Company Name", err);
          reject(err);
        } else {
          console.log("Company Deleted", data);
          resolve(data);
        }
      }
    );
  });
}

async function getAllCompaniesNames() {
  return new Promise((resolve, reject) => {
    CompanyName.find({}, { name: 1 }, function (err, data) {
      if (err) {
        console.log("Error while getting the company name", err);
        reject(err);
      } else {
        console.log(data.map((value) => value.name));
        resolve(data.map((value) => value.name));
      }
    });
  });
}

function selectedCompany(n) {
  return new Promise(async (resolve, reject) => {
    try {
      let companyNames = await getAllCompaniesNames()
      let selectedCompany = companyNames[n]
      resolve(selectedCompany)
    } catch (e) {
      console.log("Error while getting the selected company", e)
      reject(e)
    }

  })
}

async function getAllModelNames() {
  return new Promise((resolve, reject) => {
    ModelInfo.find({}, "modelName", function (err, data) {
      if (err) {
        console.log("Error while getting the model name", err);
        reject(err);
      } else {
        console.log(data.map((value) => value.modelName));
        resolve(data.map((value) => value.modelName));
      }
    });
  });
}

async function getAllTypeNames() {
  return new Promise((resolve, reject) => {
    ModelInfo.find({}, { type: 1 }, function (err, data) {
      if (err) {
        console.log("Error while getting the type names", err);
        reject(err);
      } else {
        console.log(data.map((value) => value.type));
        resolve(data.map((value) => value.type));
      }
    });
  });
}

async function deleteQuestions(question) {
    return new Promise((resolve, reject) => {
        Question.deleteOne({ message: question }, function (err, data) {
            if (err) {
                console.log("Error while deleting quetions", err)
                reject(err)
            }
            else{
                console.log("Question Deleted")
                resolve(data)
            }
        })
    })
}

async function sendFirstQuestion() {
    return new Promise((resolve, reject) => {
        Question.find({}, function (err, data) {
            if (err) {
                console.log("Error while getting the first question", err)
                reject(err)
            } else {
                console.log("First question is", data[0].message)
                resolve(data[0].message)
            }
        })
    })
}

function allCompaniesListWithIndex() {
    return new Promise(async (resolve, reject) => {
        try {
            let allNames = await getAllCompaniesNames()
            let arr = []
            for (let index = 0; index < allNames.length; index++) {
                let menu = `${index}. ` + `${allNames[index]}`
                arr.push(menu)
            }
            resolve(arr)
        } catch (e) {
            console.log("Erro while getting all the companies names with index", e)
            reject(e)
        }
    })
}

async function deleteCompanyByName (name) {
  return new Promise((resolve, reject) => {
    CompanyName.deleteOne({ name: name }, function (err, data) {
      if(err) {
        console.log("Error while deleting the company name from the company name schema", err)
        reject(err)
      } else{
        console.log("Company Deleted from the Schema Successfully")
        resolve(data)
      }
    })
  })
}

function saveUserSelectedCompany(phoneNumber, selectedCompany) {
  return new Promise(async (resolve, reject) => {
      UserResponse.findOneAndUpdate({ phoneNumber: phoneNumber }, { selectedManufacturer: selectedCompany }, function(err, data) {
        if(err) {
          console.log("Error while updating the user response", err)
          reject(err)
        } else{
          console.log("User response is upadted in saveUserSelectedCompany Function")
          resolve(data)
        }
      })
  })
}

async function companyModelNames (name) {
  return new Promise((resolve, reject) => {
    ModelInfo.find({manufacturer: name}, { modelName: 1 }, function(err, data) {
      if(err) {
        console.log("Error while getting modelnames", err)
        reject(err)
      } else {
        console.log("Model names found")
        resolve(data.map(value => value.modelName))
      }
    })
  })
}

async function currentUser (phoneNumber) {
  return new Promise((resolve, reject) => {
    UserResponse.find({phoneNumber}, function(err, data) {
      if(err) {
        console.log("Error while getting the current error", err)
        reject(err)
      } else {
        console.log("Current User found")
        resolve(data)
      }
    })
  })
}

async function findQuestion (type) {
  return new Promise((resolve, reject) => {
    Question.findOne({ type }, function(err, data) {
      if (err) {
        console.log("Error while finding the quesition", err)
        reject(err)
      }
      else{
        console.log("Question Found")
        resolve(data)
      }
    })
  })
}

async function updateCurrentQuestionAsked (phoneNumber, n) {
  return new Promise((resolve, reject) => {
    UserResponse.findOneAndUpdate({ phoneNumber: phoneNumber }, { currentQuestionAsked: n }, function (err, data) {
      if(err) {
        console.log("Error while updating the Current question asked", err)
        reject(err)
      }
      else {
        console.log("Current Question asked updated")
        resolve(data)
      }
    })
  })
}

function allModelListWithIndex(name) {
  return new Promise(async (resolve, reject) => {
      try {
          let allNames = await companyModelNames(name)
          let arr = []
          for (let index = 0; index < allNames.length; index++) {
              let menu = `${index}. ` + `${allNames[index]}`
              arr.push(menu)
          }
          resolve(arr)
      } catch (e) {
          console.log("Erro while getting all the companies names with index", e)
          reject(e)
      }
  })
}

async function deleteUser (phoneNumber) {
  return new Promise((resolve, rejet) => {
    UserResponse.deleteOne({ phoneNumber }, function (err, data) {
      if (err) {
        console.log("Unable to delete user", err)
        reject(err)
      } else {
        console.log("User deleted")
        resolve(data)
      }
    })
  })
}

async function getAllModelTypesByModelName (name) {
  return new Promise((resolve, reject) => {
    ModelInfo.find({  })
  })
}

async function getAllModelTypesByModelNameWithIndex (name) {
  return new Promise(async (resolve, reject) => {
    try {
        let allNames = await getAllModelTypesByModelName(name)
        let arr = []
        for (let index = 0; index < allNames.length; index++) {
            let menu = `${index}. ` + `${allNames[index]}`
            arr.push(menu)
        }
        resolve(arr)
    } catch (e) {
        console.log("Erro while getting all the companies names with index", e)
        reject(e)
    }
  })
}

async function getUserSelectedManufacturer(phoneNumber) {
  return new Promise((resolve, reject) => {
    UserResponse.find({ phoneNumber }, { selectedManufacturer: 1 }, function (err, data) {
      if(err) {
        console.log("Error while getting the user selected manufacturer", err)
        reject(err)
      } else {
        console.log("User selected Resposnes found")
        resolve(data.map(value => value.selectedManufacturer))
      }
    })
  })
}

async function saveUserSelectedModelName (phoneNumber, modelName) {
  return new Promise((resolve, reject) => {
    UserResponse.findOneAndUpdate({ phoneNumber }, { selectedModelName: modelName }, function(err, data) {
      if (err) {
        console.log("Unable to save the User selected Model name", err)
        reject(err)
      } else {
        console.log("User selected company is saved")
        resolve(data)
      }
    })
  })
}

async function saveUserSelectedModelType (phoneNumber, modelType) {
  return new Promise((resolve, reject) => {
    UserResponse.findOneAndUpdate({ phoneNumber }, { selectedModelType: modelType }, function(err, data) {
      if (err) {
        console.log("Unable to save the User selected Model name", err)
        reject(err)
      } else {
        console.log("User selected company is saved")
        resolve(data)
      }
    })
  })
}

module.exports = {
  getCompanyNameObjectId,
  deleteVechileInfo,
  getAllCompaniesNames,
  getAllModelNames,
  getAllTypeNames,
  deleteQuestions,
  sendFirstQuestion,
  allCompaniesListWithIndex,
  deleteCompanyByName,
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
  saveUserSelectedModelType
}
