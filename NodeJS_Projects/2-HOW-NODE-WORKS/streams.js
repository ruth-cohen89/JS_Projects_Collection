const fs =require('fs');
const server=require('http').createServer();

server.on('request', (req,res)=>{
  //Solution 1, the file is inserted into a variable: "data", stored and then sent
//   fs.readFile('test-file.txt', (err,data)=>{
//     if(err) console.log(err);
//     res.end(data);
//   });

  //Solution 2: Streams,
//   const readable = fs.createReadStream('tesst-file.txt');
//   readable.on('data', chunk=>{
//       res.write(chunk);
//   })
//   readable.on('end', ()=>{
//       res.end();
//   })
//   readable.on('error', err=>{
//     console.log(err)
//     res.statusCode = 500;
//     res.end('File not found!')
//   })

  //Solution 3, pipe
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res)
  //explanation: readableSource.pipe(writableDest)
});

//start the server
server.listen(8000, "127.0.0.1", ()=>{
    console.log('Listening bitch...')
});