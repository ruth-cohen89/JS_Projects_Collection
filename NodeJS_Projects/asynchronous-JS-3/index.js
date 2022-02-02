const fs=require('fs');
const superagent=require('superagent');

/////Promises

//get automaticaly returns a promise, 
//but readFile doesnt so we have to configure it
const readFilePro=file=>{
    return new Promise((resolve,reject)=>{
      fs.readFile(file, (err,data)=>{
          if(err) reject('Could not find the file!')
        resolve(data);
      })
    });
}

const writeFilePro=(file,data)=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(file, data, err =>{
            if(err) reject('Could not write to file!');
            resolve('success');//no special value 
        });
    });
}


////Async/Await
const getDogPic=async()=>{
  try{
    const data=await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed:${data}`);
    
    const res1Pro= superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro= superagent.get(
        `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro= superagent.get(
        `https://dog.ceo/api/breed/${data}/images/random`
    );

    //Run them simultaneously
    const all=await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs=all.map(el => el.body.message);
    console.log(imgs);


    await writeFilePro('dog-img.txt', imgs.join('\n'));      
 } catch(err){
    console.log(err);

    throw(err)
  }
  return '2:ready:😆🍦🍦';
}

//handle the async await with IIFE
(async()=>{
  try{
    console.log('1:Will get dog pics')
    //since we are in an async func we can use await
    const result=await getDogPic();
    console.log(result)
    console.log('3:Done getting dog pics')
  }  catch(err){
    console.log('ERROR😶‍🌫️')
  }
})();

//handle the async await with promises
// console.log('1:Will get dog pics')
// getDogPic()
// .then(x=>{
//     console.log(x)  
//     console.log('3:Done getting dog pics')
// })
// .catch(err=>{
//     console.log('ERROR😶‍🌫️')
// })

// //using the promises
// readFilePro(`${__dirname}/dog.txt`)
//   .then(data=>{
//    console.log(`Breed:${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
//     })
//    .then(res=>{
//     console.log(res.body.message);
//     return writeFilePro('dog-img.txt', res.body.message)
//    })
//    .then( (res)=>{
//        console.log(res)
//    })
//  .catch(err=>{
//   console.log(err);
//   });

  






//using callbacks
// superagent
//   .get(`https://dog.ceo/api/breed/${data}/images/random`)
//   .end((err,res)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(res.body.message);

//     //this callback doesnt have data, only err arg
//     fs.writeFile('dog-img.txt', res.body.message,err=>{
//         console.log("Random dog image saved to file :)")
//     })
//   });