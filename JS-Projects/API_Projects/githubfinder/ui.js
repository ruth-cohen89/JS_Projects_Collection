class UI{
    constructor(){
        this.profile=document.getElementById('profile');
    }

//mg-fluid makes it 100% of its container
//_blank makes it open on a new tab
//min 7:48
    showProfile(user){
        this.profile.innerHTML=`
        <div class="card card body mb-3">
           <div class="row">
              <div class="col-md-3">
               <img class="img-fluid mb-2" src="${user.avatar_url}";
               <a href="${user.html_url}" target="_blank" class="btn
               btn-primary btn-block">View profile</a>
               <div class="col-md-9">
                 <span class="badge badge-primary">Public Repos: 
                 ${user.public_repos}</span>
                 <span class="badge badge-secondary">Public Gists: 
                 ${user.public_gists}</span>
                 <span class="badge badge-success">Followers: 
                 ${user.followers}</span>
                 <span class="badge badge-info">Following: 
                 ${user.following}</span>
                 <br><br>
                 <ul class="list-group">
                 
                  
                 </ul>
               </div>
            </div>
           </div>
        </div>
        `;
    }
}