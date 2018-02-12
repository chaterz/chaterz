const express = require('express')

const router = express.Router()

const User = require('./user-model')

router.post('/register', function(req,res,next){
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password

    User.findOne({$or:[{username:username},{email:email}]}, function(err,user){
        if(err) res.send({error:true, message:"System error!"})
        else if(user) res.send({error:true, message:"Email or Username already in use"})
        else if(!user){
            User.hashPassword(password, function(hash){
                let newUser = new User({
                    username: username,
                    email: email,
                    password: hash
                })
                newUser.save(function(err){
                    if(err) res.send({error:true, message:"System error!"})
                    else res.send({error:false, message:"You have successfully registered!"})
                })
            })
        }
    })
})

module.exports = router