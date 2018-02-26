// import

import express = require('express'); // using require because of error on vscode
import * as mongoose from 'mongoose';

// Mongoose Init
mongoose.connect('mongodb://localhost:27017/chaterz');

const usersSchema: mongoose.Schema = new mongoose.Schema({
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
        type:Date,
        default: new Date()
    }
});

const userModel: mongoose.Model<any> = mongoose.model('user', usersSchema);

const enterpriseSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    author: {
        type:String,
        required: true
    },
    creationDate: {
        type:Date,
        default: new Date()
    }
});

const enterpriseModel: mongoose.Model<any> = mongoose.model('enterprise', enterpriseSchema);

const channelSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    author: {
        type:String,
        required: true
    },
    enterprise: {
        type:String,
        required: true
    },
    members: {
        type:[],
    }
});

const channelModel: mongoose.Model<any> = mongoose.model('channel', channelSchema);

// Express
const app: any = express();

interface User {
    email: string,
    username: string,
    password: string,
    save: Function
};

const getUsers = (success: Function) => {
    let usernames: string[] = [];
    userModel.find(null, (error: any, mongores: any) => {
        if (error) { throw error };
        const length: number = mongores.length;
        for(let i = 0; i < length; i++){
            usernames.push(mongores[i].username);
        };
        success(usernames);
    });
};

const getEnterprises = (success: Function) => {
    let enterprisesnames: string[] = [];
    enterpriseModel.find(null, (error: any, mongores: any) => {
        if(error) { throw error };
        const length: number = mongores.length;
        for(let i = 0; i < length; i++){
            enterprisesnames.push(mongores[i].name)
        };
        success(enterprisesnames);
    });
};

const getChannels = (enterprise_name: string, success: Function) => {
    let channelsnames: string[] = [];
    channelModel.find( { enterprise : enterprise_name }, (error: any, mongores: any) => {
        if(error) { throw error };
        const length: number = mongores.length;
        for(let i = 0; i < length; i++){
            channelsnames.push(mongores[i].name)
        };
        success(channelsnames);
    });
};

app.get('/signup/:email/:username/:password/', (request: any, response: any) => {
    const data: User = request.params;
    let users: any = getUsers((user_response: any) => {
        if(user_response.includes(data.username)) {
            const signedup: boolean = false;
            const reason: string[] = ['User already signed up'];
            response.send({ signedup, reason});
        } else {
            let user: User = new userModel();
            user.email = data.email;
            user.username = data.username;
            user.password = data.password;
            user.save();
            const signedup: boolean = true;
            const reason: string[] = ['User signed up'];
            response.send({ signedup, reason});
        }
    });
});

app.get('/login/:username/:password/', (request: any, response: any) => {
    const data: User = request.params;
    let users: any = getUsers((user_response: any) => {
        if(user_response.includes(data.username)) {
            userModel.find({ username: data.username }, (error: any, mongores: any,) => {
                if (error) { throw error }
                if (data.password == mongores[0].password) {
                    const connected: boolean = true;
                    const reason: string[] = ['Connected'];
                    response.send({ connected, reason });
                } else {
                    const connected: boolean = false;
                    const reason: string[] = ['Wrong Password'];
                    response.send({ connected, reason });
                }
            });
        } else {
            const connected: boolean = false;
            const reason: string[] = ['This user doesnt exist'];
            response.send({ connected, reason });
        }
    });
});

app.get('/create/enterprise/:name/:author', (request: any, response: any) => {
    const data = request.params;
    let enterprises: any = getEnterprises((enterprises_response: any) => {
        if(enterprises_response.includes(data.name)){
            const created: boolean = false;
            const reason: string[] = ['This enterprise already exist'];
            response.send({ created, reason });
        } else {
            let users = getUsers((users_response: any) => {
                if (users_response.includes(data.author)){
                    let enterprise = new enterpriseModel();
                    enterprise.name = data.name;
                    enterprise.author = data.author;
                    enterprise.save();
                    const created: boolean = true;
                    const reason: string[] = ['Enterprise created'];
                    response.send({ created, reason });
                } else {
                    const created: boolean = false;
                    const reason: string[] = ['This user doesnt exist'];
                    response.send({ created, reason });
                }
            });
        }
    });
});

app.get('/create/channel/:enterprise/:name/:author', (request: any, response: any) => {
    const data = request.params;
    let enterprises: any = getEnterprises((enterprises_response: any) => {
        if(enterprises_response.includes(data.enterprise)){
            let users = getUsers((users_response: any) => {
                if (users_response.includes(data.author)){
                    let channels = getChannels(data.enterprise, (channels_response: any) => {
                        if(channels_response.includes(data.name)){
                            const created: boolean = false;
                            const reason: string[] = ['Channel already exist'];
                            response.send({ created, reason });
                        } else {
                            let channel = new enterpriseModel();
                            channel.name = data.name;
                            channel.author = data.author;
                            channel.enterprise = data.enterprise;
                            channel.save();
                            const created: boolean = true;
                            const reason: string[] = ['Channel created'];
                            response.send({ created, reason });
                        }
                    });
                } else {
                    const created: boolean = false;
                    const reason: string[] = ['User doesnt exist'];
                    response.send({ created, reason });
                }
            });
        } else {
            const created: boolean = false;
            const reason: string[] = ['This enterprise doesnt exist'];
            response.send({ created, reason });
        }
    });
});

app.listen(4000);
