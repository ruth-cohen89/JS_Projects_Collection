//fs is the object with all fs module functionality
const fs=require('fs');
//http pack gives us networking capabilities, 
//such as an http server
const http=require('http');
//For routing 
const url = require('url');
const replaceTemplate=require('./modules/replaceTemplate');

//This is a top level code, executed only once 
//we start the program. thats why we make it syncronous.
//Unlike callbacks in res that are repeated, so it should be async in order not
//to block the rest of the users.
//Read JSON data 
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//parse JSON (string) to JS object
const dataObj=JSON.parse(data);
//Read overview template
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
//Read card template
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
//Read product template
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


//Each time a new request hits our server,
//the callback function will get called
const server=http.createServer((req,res)=>{
    
    
    const {query, pathname}=url.parse(req.url, true);

    // Overview page
    if(pathname==='/'||pathname==='/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        //map returns an array of results 
        const cardsHtml=dataObj.map(el=> replaceTemplate(tempCard,el)).join();
        //put this data in the page
        const output=tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        
        res.end(output);

    // Product page
    } else if(pathname==='/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);

        res.end(output);

    // API (fake)
    } else if(pathname==='/api'){ 
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(dataObject);
    }

    // Not found
    else { 
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









