const EventEmitter=require('events');

const http=require("http");

//////custom events
//we need to emit the events ourselves

//super class is the eventemitter
//parent is the sales class
class Sales extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter= new Sales();


//Listeners, when theres an event they execute their callbacks
//(observers, they observe the emitter and wait for newSale event)
myEmitter.on('newSale', ()=>{
    console.log("There was a new sale!");
});

myEmitter.on('newSale', ()=>{
    console.log("costumer name:Jonas")
});

myEmitter.on('newSale', stock=>{
    console.log(`There are ${stock} left`)
})

//Emitting an event
myEmitter.emit('newSale',9);

/////built-in modules
//the functions will emit their own events

const server = http.createServer();

server.on('request', (req, res)=>{
    console.log("Request recieved!");
    console.log(req.url)
    res.end('yofi')
   
})

server.on('request', (req, res)=>{
    console.log("another Request recieved!");
   
})


server.on('close', ()=>{
    console.log('Server closed')
})

//Restart the server
server.listen(8000, '127.0.0.1', ()=>{
    console.log("Waiting for incoming requests...");
})