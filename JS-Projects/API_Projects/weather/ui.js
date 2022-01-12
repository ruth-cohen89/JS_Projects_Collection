console.log('start')

function loginUser(email,pass){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve ({userEmail:email})
        },1500);
    })

}

const user=loginUser('gg')

console.log('finish')