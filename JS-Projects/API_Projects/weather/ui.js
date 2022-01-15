class UI{
    constructor(){
        this.location=document.getElementById('w-location');
        this.desc=document.getElementById('w-desc');
        this.degrees=document.getElementById('w-string');
        this.icon=document.getElementById('w-icon');
        this.humidity=document.getElementById('w-humidity');
        this.feelsLike=document.getElementById('w-feels-like');
        this.windSpeed=document.getElementById('w-windSpeed');
    }
    paint(weather,city){
        let country=weather.sys.country;
        this.location.textContent=`${city} `;
        this.desc.textContent=weather.weather[0].main;
        this.degrees.textContent=`${weather.main.temp}°C`;//degrees in C
        let icon=weather.weather[0].icon;
        this.icon.setAttribute('src',`https://openweathermap.org/img/wn/${icon}@2x.png`);
        this.humidity.textContent=`Humidity: ${weather.main.humidity}%`;
        this.feelsLike.textContent=`Feels Like: ${weather.main.feels_like}°C`;
        this.windSpeed.textContent=`Wind Speed: ${weather.wind.speed} km/h`;///להוסיף דצימל?
    }

}