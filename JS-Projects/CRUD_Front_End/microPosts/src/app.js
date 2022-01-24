//commonJS module syntax
// const person=require('./myModule1');
// console.log(person)

// //ES2015 Module syntax
// import{person2, sayHello} from './myModule2'

// //import all with ES2015
// import * as mod from './myModule2'

import {http} from './http'
import {ui} from './ui'

//Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

//Listen for add post
document.querySelector('.post-submit').addEventListener('click',
 submitPost);

//  ui.postSubmit.addEventListener('click',
//  addPost);

//Listen for delete and edit post
document.querySelector('#posts').addEventListener('click',
 changePost);

function getPosts(){
    http.get('http://localhost:3000/posts')
    .then(data=>ui.showPosts(data))
    .catch(err => console.log(err))
}

//Submit Post (add and edit)
function submitPost(){
    const title=document.querySelector('#title').value;
    const body=document.querySelector('#body').value;
    
    const data={
        title,
        body
    }

    //Create post
    http.post('http://localhost:3000/posts', data)
    .then((posts)=>{
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        getPosts(posts);
    })
    .catch(err=> console.log(err));
}

function changePost(e){
    if(e.target.class==='delete'){
        console.log(target.parent.parent)
        // let post=target.parent.parent.value.id;
        // http.delete('http://localhost:3000/posts')
    }

    e.preventDefault(); 
}