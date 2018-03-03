// import
import express = require('express'); // using require because of error on vscode
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import { request } from 'http';

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
    },
    creationDate: {
        type:Date,
        default: new Date()
    }
});

const channelModel: mongoose.Model<any> = mongoose.model('channels', channelSchema);

const messageSchema: mongoose.Schema = new mongoose.Schema({
    user: {
        type:String,
        required: true
    },
    content: {
        type:String,
        required: true
    },
    channel: {
        type:String,
        required: true
    },
    enterprise: {
        type:String,
        required: true
    },
    creationDate: {
        type:Date,
        default: new Date()
    }
});

const messageModel: mongoose.Model<any> = mongoose.model('messages', messageSchema);

// Express
const app: any = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

const getMembers = (channel_name: string, success: Function) => {
    let membersnames: string[] = [];
    channelModel.find( { name : channel_name }, (error: any, mongores: any) => {
        if(error) { throw error };
        const length: number = mongores.length;
        for(let i = 0; i < length; i++){
            membersnames.push(mongores[i].members);
        };
        success(membersnames);
    });
};

app.post('/signup/', (request: any, response: any) => {
    const data: User = request.body;
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

app.post('/login/', (request: any, response: any) => {
    const data: User = request.body;
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

app.post('/create/enterprise/', (request: any, response: any) => {
    const data: any = request.body;
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

app.post('/create/channel/', (request: any, response: any) => {
    const data: any = request.body;
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
                            let channel = new channelModel();
                            channel.name = data.name;
                            channel.author = data.author;
                            channel.enterprise = data.enterprise;
                            channel.members = [data.author];
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

app.post('/join/channel/', (request: any, response: any) => {
    const data: any = request.body;
    let users = getUsers((users_response: any) => {
        if(users_response.includes(data.user)){
            let members = getMembers(data.channel, (members_response: any) => {
                if(members_response.includes(data.user)) {
                    const joined: boolean = false;
                    const reason: string[] = ['This user already joined this channel']
                } else {
                    const new_members: string[] = members_response.push(data.user);
                    channelModel.update({ name : data.channel }, { members : new_members }, (error) => {
                        if(error) { throw error };
                        const joined: boolean = true;
                        const reason: string[] = ['User joined this channel'];
                        response.send({ joined, reason });
                    });
                }
            });
        } else {
            const joined: boolean = false;
            const reason: string[] = ['User doesnt exist'];
            response.send({ joined, reason });
        }
    });
});

app.post('/post/message/', (request: any, response: any) => {
    const data = request.body;
    let users = getUsers((users_response: any) => {
        if(users_response.includes(data.user)){
            let channels = getChannels(data.enterprise, (channels_response: any) => {
                if(channels_response.includes(data.channel)){
                    let message = new messageModel();
                    message.user = data.user;
                    message.content = data.content;
                    message.channel = data.channel;
                    message.enterprise = data.enterprise;
                    message.save();
                    const posted: boolean = true;
                    const reason: string[] = ['Message posted'];
                    response.send({ posted, reason });
                } else {
                    const posted: boolean = false;
                    const reason: string[] = ['Channel doesnt exist'];
                }
            });     
        } else {
            const posted: boolean = false;
            const reason: string[] = ['User doesnt exist'];
        }
    });
});

app.get('/get/enterprises/', (request: {}, response: { send: Function }) => {
    let enterprises = getEnterprises((enterprises_response: string[]) => {
        response.send(enterprises_response);
    });
});

app.get('/get/channels/:enterprise', (request: { params: { enterprise: string } }, response: { send: Function }) => {
    const data: { enterprise: string } = request.params;
    let enterprises = getEnterprises((enterprises_response: any) => {
        if(enterprises_response.includes(data.enterprise)) {
            let channels = getChannels(data.enterprise, (channels_response: string[]) => {
                response.send(channels_response);
            });
        } else {
            const error: string[] = ['Enterprise doesnt exist'];
            response.send({error});
        }
    });
});

app.get('/get/members/:enterprise/:channel', (request: { params: { enterprise: string, channel: string } }, response: { send: Function }) => {
    const data: { enterprise: string, channel: string } = request.params;
    let enterprises = getEnterprises((enterprises_response: any) => {
        if(enterprises_response.includes(data.enterprise)) {
            let channels = getChannels(data.enterprise, (channels_response: any) => {
                if(channels_response.includes(data.channel)){
                    let members = getMembers(data.channel, (members_response: string[]) => {
                        response.send(members_response);
                    });
                } else {
                    const error: string[] = ['Channel doesnt exist'];
                    response.send({error});
                }
            });
        } else {
            const error: string[] = ['Enterprise doesnt exist'];
            response.send({error});
        }
    });
});

app.get('/get/messages/:enterprise/:channel', (request: { params: { enterprise: string, channel: string } }, response: { send: Function } ) => {
    const data: { enterprise: string, channel: string } = request.params;
    let enterprises = getEnterprises((enterprises_response: any) => {
        if(enterprises_response.includes(data.enterprise)) {
            let channels = getChannels(data.enterprise, (channels_response: any) => {
                if(channels_response.includes(data.channel)){
                    messageModel.find({enterprise: data.enterprise, channel: data.channel}, (err: {}, mongores: {}) => {
                        response.send(mongores);
                    });
                } else {
                    const error: string[] = ['Channel doesnt exist'];
                    response.send({error});
                }
            });
        } else {
            const error: string[] = ['Enterprise doesnt exist'];
            response.send({error});
        }
    });
    
})

app.listen(process.env.PORT || 4000);
