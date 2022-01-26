const fs=require('fs');
//fs is the object with all fs module functionality
const http=require('http');
//http pack gives us networking capabilities, 
//such as an http server
const url = require('url');
//For routing 

////////////////////////////////////////////////////////
//SERVER 

//Each time a new request hits our server,
//this callback function will get called.

//This is a top level code, executed only once 
//we start the program. thats why we make it syncronous.
//Unlike callbacks in res that are repeated, so it should be async in order not
//to block the rest of the users.
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//parse JSON (string) to JS object
const dataObject=JSON.parse(data);

const server=http.createServer((req,res)=>{
    const pathName=req.url;

    // Overview page
    if(pathName==='/'||pathName==='/overview'){
        res.end('Thats the overview!');

    // Product page
    } else if(pathName==='/product'){
        res.end('Thats the product!');

    // API
    } else if(pathName==='/api'){
        
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
    }
    else { //Any other req
      res.writeHead(404,{
        'Content-type': 'text/html',
        'my-header':'hi strong' 
    });
      res.end('<h1>page not found</h1>');
    }
    
});

//Specify where the server listens
server.listen(8000,'127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000');
})









