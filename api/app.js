const express = require('express')

const app = express()

const router = require('./register')

app.use(express.urlencoded({extended:false}), router);


app.listen(3000, function(){
    console.log("Server running on port 3000")
})