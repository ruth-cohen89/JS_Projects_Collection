//Init gitHub
const gitHub=new GitHub;
//Init ui
const ui=new UI;

//search input
const searchUser=document.getElementById('searchUser');

//search input event listener
searchUser.addEventListener('keyup',(e)=>{
    //Get input text
    const userText=e.target.value;
  
    if(userText.text!==''){
        //Make http calls
        gitHub.getUser(userText)
        .then(data=>{
            if(data.profile.message==='Not Found'){
                //Show alert
                ui.showAlert('user not found', 'alert alert-danger')
            }else{
                //Show profile
                ui.showProfile(data.profile);
            }
      })
    } else {
    // Clear profile
    ui.clearProfile();
    }
    
});

