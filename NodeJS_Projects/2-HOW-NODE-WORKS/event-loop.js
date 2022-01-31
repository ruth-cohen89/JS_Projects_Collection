const fs=require('fs');
const crypto=require('crypto');

const start=Date.now();
process.env.UV_THREADPOOL_SIZE=1;

fs.readFile('text-file.txt', ()=>{
    console.log('I/O Finished'); 

    setTimeout(()=>console.log("Timer 1 finished:)"), 0);

    setTimeout(()=>console.log("Timer 3 finished:)"), 3000);    

    setImmediate(()=>console.log("immidate 2 finished!"));

    process.nextTick(()=>console.log('process.nextTick'))

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512'); 
        console.log(Date.now()-start, "Pass encypted")

})

setImmediate(()=>console.log("immedate 1 finished!"));
console.log('top level code')