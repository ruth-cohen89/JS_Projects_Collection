class UI{
    constructor(){
        this.location=document.getElementById('w-location');
        this.desc=document.getElementById('w-desc');
        this.string=document.getElementById('w-string');
        this.icon=document.getElementById('w-icon');
        this.humidity=document.getElementById('w-humidity');
        this.feelsLike=document.getElementById('w-feels-like');
        this.windSpeed=document.getElementById('w-windSpeed');
    }
    paint(weather){
        this.location.textContent=weather.country;
        console.log(weather.wind.speed)
        this.desc.textContent=weather.weather[0].main;
        this.string.textContent=weather.main.temp;//degrees in C
        this.icon.setAttribute('src',weather.weather[0].icon);//???
        this.humidity.textContent=weather.main.humidity;
        this.feelsLike.textContent=weather.main.feels_like;
        this.windSpeed.textContent=weather.wind.speed;///להוסיף דצימל?
    }

}