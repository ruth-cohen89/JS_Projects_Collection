//All are built using the Module pattern
//Storage controller
const StorageCtrl=(function(){
  

    // addToStorage:function(item){
    //     if (localStorage.getItem('items')===null){
    //         items=[];
    //     } else {
    //         items=JSON.parse(localStorage.getItem('items'));
    //     }
    //     items.push(item);
    //     localStorage.setItem('items', JSON.stringify(items))
    // }

    // removeFromStorage:function(item){
    //     items=JSON.parse(localStorage.getItem('items'));

    //     items.forEach((storageItem,index)=>{
    //         if(storageItem===item){
    //             tasks.splice(index,1)
    //         }
    //     });
    // },

    // getStorage:function(){
    //     items=JSON.parse(localStorage.getItem('items'));
    //     return(items)
    // },

    // clearStorage:function(){
    //     localStorage.clear();
    // }


})();
    
//Item Controller
const ItemCtrl=(function(){
    //Item Constructor
    const Item=function(id, name, calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }

    // Data Structure / State
    const data={
       items:[
         {id:0, name:'Pizza', calories:500},
         {id:1, name:'Omelet', calories:250},
         {id:2, name:'Chocolate Cake', calories:200}
       ],
       currentItem:null,
       totalCalories:0
    }

    //Public methods
    return {
        getItems:function(){
            return data.items
        },
        logData: function(){
           return data;
        }
    }
})();

//UI Controller, showing and hiding
const UICtrl=(function(){
    let items;

    //Public methods
    return{

    }

})();

//App Controller, initializer
const AppCtrl=(function(ItemCtrl,UICtrl,StorageCtrl){
    
    //Public methods
    return{
        init: function(){
            console.log('Initializing App...')

            //Fetch items from data sturcture
            const items=ItemCtrl.getItems();

            //Populate list with items
            UICtrl
        }
    }

})(ItemCtrl,UICtrl,StorageCtrl);

//Initalizing App
AppCtrl.init();


