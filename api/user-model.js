const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const db = mongoose.createConnection('mongodb://admin:admin@ds125628.mlab.com:25628/chartez')

const userShema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    joinDate:{
        type: Date,
        default: new Date()
    }
})

userShema.statics.hashPassword = function(password, callback){
    bcrypt.genSalt(function(err,salt){
        if(err) return callback()
        else{
            bcrypt.hash(password,salt, function(err,hash){
                if(err) return callback()
                else return callback(hash)
            })
        }
    })
} 

const User = db.model('user', userShema, 'users')
module.exports = User

