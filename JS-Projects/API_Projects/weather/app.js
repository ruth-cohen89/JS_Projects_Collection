const storage=new Storage();
//Get data from localStorage
const city=storage.getStorageData();
console.log(city)
//Init new weather
const weather=new Weather(city);

//Init UI
const ui=new UI();

//Default when page is loaded
document.addEventListener('DOMContentLoaded',function(){
    weather.getWeather()
    .then(response=>ui.paint(response));
});


