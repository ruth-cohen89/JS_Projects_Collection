class Storage{
    constructor(){
        this.city;
        this.defaultCity='Jerusalem';
    }

    getStorageData(){
        if(localStorage.getItem('city')===null){
            this.city=this.defaultCity;
        }
        else{
            this.city=localStorage.getItem('city');
    }
    return this.city;
}

    setWeatherData(city){
        localStorage.setItem('city',city);
    }
}