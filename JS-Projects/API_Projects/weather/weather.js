class Weather{
    constructor(state){
        this.apiKey='3ff22c204404bee25acf92b9b2f25e70';
        this.city=city;
    }
    async getWeather(){
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`)
        const responseData=await response.json();
        return responseData;
    }
    setWeather(city){
        this.city=city;
    }

}