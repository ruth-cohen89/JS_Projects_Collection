//All controllers are built with the Module pattern
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
        //  {id:0, name:'Pizza', calories:500},
        //  {id:1, name:'Omelet', calories:250},
        //  {id:2, name:'Chocolate Cake', calories:200}
       ],
       currentItem:null,
       totalCalories:0
    }

    //Public methods
    return {
        addItem:function(name, calories){
            let ID;
            //Create id
            if (data.items.length>0){
                ID=data.items[data.items.length-1].id +1;
            } else {
                ID=0;
            }

            //Calories to number
            calories=parseInt(calories);

            //Create new item,
            //Every entitity of Item has its own id, name, calories 
            //and an array of all data (of the former items), but the ItemCtrl is only one
            const newItem=new Item(ID, name, calories);

            //Add to items array of the controller
            data.items.push(newItem);
  
            return newItem;
        },
        getItems:function(){
            return data.items
        },
        getTotalCalories(){
            let total=0;

            //Loop through items and add cals
            data.items.forEach((item)=>{
                total+=item.calories;
            });
            //set total cal in data structure
            data.totalCalories=total;

            //Return total
            return data.totalCalories;
        },
        logData: function(){
           return data;
        }
    }
})();

//UI Controller, showing and hiding
const UICtrl=(function(){
    //Makes the code more efficient & scalable,
    //We can change selectors easily
    const UISelectors={
        itemList: '#item-list',
        addBtn:'.add-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        itemList:'#item-list',
        totalCalories:'.total-calories'
    }

    //Public methods
    return{
        populateItemList: function(items){
            let html='';
            items.forEach((item)=>{
              html+=`<li class="collection-item"
               id="item-${item.id}">
              <strong>${item.name}: </strong> 
              <em>${item.calories}</em>
              <a href="#" class="secondary-content">
                <i class="edit item fa fa-pencil"></i>
              </a>`
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML=html;
        },
        getItemInput:function(){
            return{
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem:function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display='block'
            //Create li element
            const li=document.createElement('li');
            //Add class
            li.className='collection-item';
            //Add id
            li.id=`item=${item.id}`
            //Add html
            li.innerHTML=`
           <strong>${item.name}: </strong> 
           <em>${item.calories}</em>
           <a href="#" class="secondary-content">
             <i class="edit item fa fa-pencil"></i>
           </a>`;
           //Insert item
           document.querySelector(UISelectors.itemList).insertAdjacentElement
           ('beforeend',li)
        },
        showTotalCalories:function(total){
            document.querySelector(UISelectors.totalCalories).textContent=total;
            console.log(total)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        getSelectors:function(){
         return UISelectors;
        }

    }

})();

//App Controller, initializer
const AppCtrl=(function(ItemCtrl,UICtrl,StorageCtrl){

    //Load event listeners
    const loadEventListeners=function(){
      //Get UI Selectors
      const UISelectors=UICtrl.getSelectors();
      //Add item event
      document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
    }
    
    //Add Item submit
    const itemAddSubmit=function(e){
        //Get form input from UI controller
        const input=UICtrl.getItemInput();
        
        //Check for name and calorie input
        if(input.name!==''&& input.calories!==''){
            //Add item
            const newItem=ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            //Get total calories
            const totalCalories=ItemCtrl.getTotalCalories();
            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            //Clear fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    //Public methods
    return{
        init: function(){

            //Fetch items from data structure
            const items=ItemCtrl.getItems();

            //Check if any items
            if(items.length===0){
                UICtrl.hideList();
            } else {
                 //Populate list with items
                 UICtrl.populateItemList(items);
            }
            
            //Get total calories
            const totalCalories=ItemCtrl.getTotalCalories();
            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);            
            
            //Load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl,UICtrl,StorageCtrl);

//Initalizing App
AppCtrl.init();


