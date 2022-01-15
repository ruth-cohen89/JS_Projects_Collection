class Storage{
    constructor(){
        this.city;
        this.defaultCity='Jerusalem';//If nothing in LS
    }

    //Gets city from local storage
    getStorageData(){
        if(localStorage.getItem('city')===null){
            this.city=this.defaultCity;
        }
        else{
            this.city=localStorage.getItem('city');
    }

    return this.city;
}

    //Sets city in local storage
    setStorage(city){
        localStorage.setItem('city',city);
    }
}