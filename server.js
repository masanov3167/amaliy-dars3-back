const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require("mongoose")
const router = require('./router')

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://masanov:masanov3167@cluster0.ss2bslz.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true})
.then(()=>{console.log("success ")})
.catch((err)=>{console.log(err)})
const PORT = process.env.PORT  || 5000;

app.use(cors())
app.use(express.json())
app.use(router)

app.listen(PORT, console.log(`run server ${PORT} port`))

