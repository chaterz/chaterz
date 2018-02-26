"use strict";
exports.__esModule = true;
// import
var express = require("express"); // using require because of error on vscode
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// Mongoose Init
mongoose.connect('mongodb://localhost:27017/chaterz');
var usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        "default": new Date()
    }
});
var userModel = mongoose.model('user', usersSchema);
var enterpriseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        "default": new Date()
    }
});
var enterpriseModel = mongoose.model('enterprise', enterpriseSchema);
var channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    enterprise: {
        type: String,
        required: true
    },
    members: {
        type: []
    }
});
var channelModel = mongoose.model('channel', channelSchema);
// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
;
var getUsers = function (success) {
    var usernames = [];
    userModel.find(null, function (error, mongores) {
        if (error) {
            throw error;
        }
        ;
        var length = mongores.length;
        for (var i = 0; i < length; i++) {
            usernames.push(mongores[i].username);
        }
        ;
        success(usernames);
    });
};
var getEnterprises = function (success) {
    var enterprisesnames = [];
    enterpriseModel.find(null, function (error, mongores) {
        if (error) {
            throw error;
        }
        ;
        var length = mongores.length;
        for (var i = 0; i < length; i++) {
            enterprisesnames.push(mongores[i].name);
        }
        ;
        success(enterprisesnames);
    });
};
var getChannels = function (enterprise_name, success) {
    var channelsnames = [];
    channelModel.find({ enterprise: enterprise_name }, function (error, mongores) {
        if (error) {
            throw error;
        }
        ;
        var length = mongores.length;
        for (var i = 0; i < length; i++) {
            channelsnames.push(mongores[i].name);
        }
        ;
        success(channelsnames);
    });
};
app.post('/signup/', function (request, response) {
    var data = request.body;
    var users = getUsers(function (user_response) {
        if (user_response.includes(data.username)) {
            var signedup = false;
            var reason = ['User already signed up'];
            response.send({ signedup: signedup, reason: reason });
        }
        else {
            var user = new userModel();
            user.email = data.email;
            user.username = data.username;
            user.password = data.password;
            user.save();
            var signedup = true;
            var reason = ['User signed up'];
            response.send({ signedup: signedup, reason: reason });
        }
    });
});
app.post('/login/', function (request, response) {
    var data = request.body;
    var users = getUsers(function (user_response) {
        if (user_response.includes(data.username)) {
            userModel.find({ username: data.username }, function (error, mongores) {
                if (error) {
                    throw error;
                }
                if (data.password == mongores[0].password) {
                    var connected = true;
                    var reason = ['Connected'];
                    response.send({ connected: connected, reason: reason });
                }
                else {
                    var connected = false;
                    var reason = ['Wrong Password'];
                    response.send({ connected: connected, reason: reason });
                }
            });
        }
        else {
            var connected = false;
            var reason = ['This user doesnt exist'];
            response.send({ connected: connected, reason: reason });
        }
    });
});
app.post('/create/enterprise/', function (request, response) {
    var data = request.body;
    var enterprises = getEnterprises(function (enterprises_response) {
        if (enterprises_response.includes(data.name)) {
            var created = false;
            var reason = ['This enterprise already exist'];
            response.send({ created: created, reason: reason });
        }
        else {
            var users = getUsers(function (users_response) {
                if (users_response.includes(data.author)) {
                    var enterprise = new enterpriseModel();
                    enterprise.name = data.name;
                    enterprise.author = data.author;
                    enterprise.save();
                    var created = true;
                    var reason = ['Enterprise created'];
                    response.send({ created: created, reason: reason });
                }
                else {
                    var created = false;
                    var reason = ['This user doesnt exist'];
                    response.send({ created: created, reason: reason });
                }
            });
        }
    });
});
app.post('/create/channel/', function (request, response) {
    var data = request.body;
    var enterprises = getEnterprises(function (enterprises_response) {
        if (enterprises_response.includes(data.enterprise)) {
            var users = getUsers(function (users_response) {
                if (users_response.includes(data.author)) {
                    var channels = getChannels(data.enterprise, function (channels_response) {
                        if (channels_response.includes(data.name)) {
                            var created = false;
                            var reason = ['Channel already exist'];
                            response.send({ created: created, reason: reason });
                        }
                        else {
                            var channel = new enterpriseModel();
                            channel.name = data.name;
                            channel.author = data.author;
                            channel.enterprise = data.enterprise;
                            channel.save();
                            var created = true;
                            var reason = ['Channel created'];
                            response.send({ created: created, reason: reason });
                        }
                    });
                }
                else {
                    var created = false;
                    var reason = ['User doesnt exist'];
                    response.send({ created: created, reason: reason });
                }
            });
        }
        else {
            var created = false;
            var reason = ['This enterprise doesnt exist'];
            response.send({ created: created, reason: reason });
        }
    });
});
app.listen(4000);
