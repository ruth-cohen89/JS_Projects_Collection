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

//Listen for delete post
document.querySelector('#posts').addEventListener('click',
deletePost);

//Listen for enable edit post
document.querySelector('#posts').addEventListener('click',
enableEdit);

//Listen for cancel
document.querySelector('.card-form').addEventListener('click',
cancelEdit)

function getPosts(){
    http.get('http://localhost:3000/posts')
    .then(data=>ui.showPosts(data))
    .catch(err => console.log(err))
}

//Submit Post (add and edit)
function submitPost(){
    const title=document.querySelector('#title').value;
    const body=document.querySelector('#body').value;
    const id=document.querySelector('#id').value;

    const data={
        title,
        body
    }

    //Validate input
    if(title===''||body===''){
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    } else {
     //Check for ID (hidden field)
     if(id===''){
     
       //Create post
       http.post('http://localhost:3000/posts', data)
        .then((posts)=>{
          ui.showAlert('Post added', 'alert alert-success');
          ui.clearFields();
          getPosts(posts);
        })
        .catch(err=> console.log(err));
   } else {
    //Update post
    http.put(`http://localhost:3000/posts/${id}`, data)
    .then((posts)=>{
      ui.showAlert('Post updated', 'alert alert-success');
      ui.changeFormState('add');
      getPosts(posts);
    })
    .catch(err=> console.log(err));

}
    }
}

function deletePost(e){
    if(e.target.parentElement.classList.contains('delete')){
        const id=e.target.parentElement.dataset.id;
        if(confirm('Are you sure?')){
            
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data=> {
              ui.showAlert('Post Removed', 'alert alert-success');
            getPosts();
            })
            .catch(err=>console.log(err));
        }

    }

    e.preventDefault(); 
}


//Enable Edit State
function enableEdit(e){
    if(e.target.parentElement.classList.contains('edit')){
      const id=e.target.parentElement.dataset.id;
      const title=e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
      const body=e.target.parentElement.previousElementSibling.textContent;

      const data={
          id,
          title,
          body
      }

      //Fill from
      ui.fillForm(data);
    }
    e.preventDefault()
}

//Cancel edit state
function cancelEdit(e){
  if(e.target.classList.contains('post-cancel')){
      ui.changeFormState('add');
  }

  e.preventDefault();
}