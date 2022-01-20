//The chatroom is the mediator between the users of the chatroom
//the users are the chatroom colleagues

//User Constructor
const User=function(name){
    this.name=name;
    this.chatroom=null;
}

//User prototype functions
User.prototype={
    send: function(message, to){
        this.chatroom.send(message, this, to);
    },
    receive: function(message,from){
        console.log(`${from.name} to ${this.name}: ${message}`)
    }
}



//Chatroom is the mediator between the users,
//It delivers the messages, It gets a message from the source,
// does some functionality and sends it to the target
//Chatroom constructor
const Chatroom=function(){
    let users={};//dict of users

    return{
        //the colleagues need to register to the mediator
        register: function(user){
            users[user.name]=user;
            user.chatroom=this;
        },

        send: function(message, from, to){
         if(to){
             //Single user message
            to.receive(message, from)
         } else {
            //Mass message - broadcast
            for(key in users){
                if(users[key]!==from)
                users[key].receive(message,from)
            }
           }
        }
    }
}
const Ruth=new User('Ruth');
const Jenny=new User('Jenny');
const Brad=new User('Brad')

const chatroom=new Chatroom();

chatroom.register(Ruth)
chatroom.register(Jenny)
chatroom.register(Brad)

Brad.send('Hi Ruth',Ruth)
Ruth.send('we will rock you!')