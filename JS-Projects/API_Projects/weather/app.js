//Init storage
const storage=new Storage();

//Get data from localStorage
const city=storage.getStorageData();

//Init weather with the city
const weather=new Weather(city);

//Init UI
const ui=new UI();

//Default when page is loaded
document.addEventListener('DOMContentLoaded',function(){
    weather.getWeather()
    .then(response=>ui.paint(response,city));
});

//Event listener for changing city
document.getElementById('w-change-btn').addEventListener('click',changeLocation);
//close modal

//Changing location
function changeLocation(){
    const city=document.getElementById('city').value;

    //change location in local storage 
    storage.setStorage(city);

    //update Weather object
    weather.setWeather(city);

    //Fetch city data and display new city in UI
    weather.getWeather()
    .then(response=>ui.paint(response,city))
    .catch(err=>console.log(err));

    //close modal
    $('#locModal').modal('hide');
}



