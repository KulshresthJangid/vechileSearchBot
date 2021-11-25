require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const db = require('./db/db')
const app = express()
const spreadSheetRoute = require('./routes/spreadSheetData')
const { getCompanyNameObjectId } = require('./utils/utils')

app.use(express.json())
app.use(spreadSheetRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})