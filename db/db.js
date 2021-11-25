require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("DB connection established")
}).catch((e) => {
    console.log("There was an unexpected error while connecting to DB", e)
})