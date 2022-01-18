//Data, pretend it comes from an API, (only the image does)
const data=[
    {
        name: 'John Doe',
        age:32,
        gender:'male',
        lookingFor:'female',
        location:'Boston MA',
        image: 'https://randomuser.me/api/portraits/men/82.jpg'
    },
    {
      name: 'Jen Smith',
      age: 26,
      gender: 'female',
      lookingFor: 'male',
      location: 'Miami FL',
      image: 'https://randomuser.me/api/portraits/women/82.jpg'
    },
    {
      name: 'William Johnson',
      age: 38,
      gender: 'male',
      lookingFor: 'female',
      location: 'Lynn MA',
      image: 'https://randomuser.me/api/portraits/men/83.jpg'
    }
];

const profiles=profileIterator(data);

//Call first profile
nextProfile()

document.getElementById('next').addEventListener('click',nextProfile);

//Next Profile Display
function nextProfile(){
    const currentProfile=profiles.next().value;
   
    //Profiles are not over, display next one now
    if(currentProfile!==undefined){
    document.getElementById('profileDisplay').innerHTML=`
    <ul class="list=group">
        <li class="list-group-item"> Name: ${currentProfile.name}</li>
        <li class="list-group-item"> Age: ${currentProfile.age}</li>
        <li class="list-group-item"> Gender: ${currentProfile.gender}</li>
        <li class="list-group-item"> Looking for: ${currentProfile.lookingFor}</li>
        <li class="list-group-item"> Location: ${currentProfile.location}</li>
    `;

    document.getElementById('imageDisplay').innerHTML=`
    <img src="${currentProfile.image}">`
    }else{
        //Profiles are over - reload the page
        window.location.reload();
    }
}

//Profile Iterator
function profileIterator(profiles){
    let nextIndex=0;

    return{
        next:function(){
            return nextIndex<profiles.length? 
            {value:profiles[nextIndex++],done:false} : 
            {done:true}
        }
    }
}
