//All controllers are built with the Module pattern
// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {
      storeItem: function(item){
        let items;
        // Check if any items in ls
        if(localStorage.getItem('items') === null){
          items = [];
          // Push new item
          items.push(item);
          // Set ls
          localStorage.setItem('items', JSON.stringify(items));
        } else {
          // Get what is already in ls
          items = JSON.parse(localStorage.getItem('items'));
  
          // Push new item
          items.push(item);
  
          // Re set ls
          localStorage.setItem('items', JSON.stringify(items));
        }
      },
      getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },
      updateItemStorage:function(updatedItem){
        let items=JSON.parse(localStorage.getItem('items'));
        
        items.forEach((item,index)=>{
            if(updatedItem.id===item.id){
                items.splice(index,1,updatedItem);

            }
        });
      //Reset local storage
      localStorage.setItem('items', JSON.stringify(items));
      },

      deleteItemFromStorage:function(id){
        let items=JSON.parse(localStorage.getItem('items'));
        
        items.forEach((item,index)=>{
            if(id===item.id){
                items.splice(index,1);
            }
        });
      //Reset local storage
      localStorage.setItem('items', JSON.stringify(items));
      },
      clearItemsFromStorage:function(){
          localStorage.removeItem('items');
      }
    
    }
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
      // items:[
        //  {id:0, name:'Pizza', calories:500},
        //  {id:1, name:'Omelet', calories:250},
        //  {id:2, name:'Chocolate Cake', calories:200}
       //],
       items:StorageCtrl.getItemsFromStorage(),
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
            } else {//first item
                ID=0;
            }

            //Calories to number
            calories=parseInt(calories);

            //Create new item,
            //Every entitity of Item has its own id, name, calories 
            //The ItemCtrl is only one entity that contain item entities
            const newItem=new Item(ID, name, calories);

            //Add to the items array
            data.items.push(newItem);
  
            return newItem;
        },
        getItemById:function(id){
            let found=null;
            console.log(id)
            //Loop through the items
            data.items.forEach((item)=>{
               console.log(id)
                if(item.id===id){
                    found=item;
                }
                
            });
            console.log(found)
            return found;

        },

        updateItem:function(name,calories){
            //Calories to number (its coming from the form)
            calories=parseInt(calories);

            let found=null;
            data.items.forEach((item)=>{
                if(item.id===data.currentItem.id){
                    item.name=name;
                    item.calories=calories;
                    found=item;
                   
                }
            });
            
            return found;
            
        },
        deleteItem:function(id){
            //Get ids
            const ids=data.items.map(function(item){
                return item.id;
            });

            //Get index of the id
            const index=ids.indexOf(id);

            //Remove item
            data.items.splice(index,1);
            console.log(data.items)
           
        },
        clearAllItems:function(){
            data.items=[];
        },
        getItems:function(){
            return data.items
        },
        setCurrentItem:function(item){
            data.currentItem=item;
        },
        getCurrentItem:function(){
            return data.currentItem;
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


// UI Controller
const UICtrl = (function(){
    const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }
    
    // Public methods
    return {
      populateItemList: function(items){
        let html = '';
  
        items.forEach(function(item){
          html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
        });
  
        // Insert list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },
      getItemInput: function(){
        return {
          name:document.querySelector(UISelectors.itemNameInput).value,
          calories:document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },
      addListItem: function(item){
        // Show the list
        document.querySelector(UISelectors.itemList).style.display = 'block';
        // Create li element
        const li = document.createElement('li');
        // Add class
        li.className = 'collection-item';
        // Add ID
        li.id = `item-${item.id}`;
        // Add HTML
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        // Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
      },
      updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);
  
        // Turn Node list into array
        listItems = Array.from(listItems);
  
        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');
        
          if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
          }
        });
      },
      deleteListItem: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },
      clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },
      addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      },
      removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);
  
        // Turn Node list into array
        listItems = Array.from(listItems);
  
        listItems.forEach(function(item){
          item.remove();
        });
      },
      hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
      },
      showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
      },
      clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
      },
      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },
      getSelectors: function(){
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
      document.querySelector(UISelectors.addBtn).addEventListener('click',
      itemAddSubmit);
      
      //Disable submit on the enter key
      document.addEventListener('keypress',function(e){
          if (e.which===13|| e.keyCode===13){
              e.preventDefault();
              return false;
          }
      });
      //Edit icon click event, we target the father,
      //we use event delegation, the edit button was added after the DOM was loaded, so we search it in its father
      document.querySelector(UISelectors.itemList).addEventListener('click',
      itemEditClick);

      //Event listener for update meal button
      document.querySelector(UISelectors.updateBtn).addEventListener('click',
      itemUpdateSubmit);

      //Delete button event
      document.querySelector(UISelectors.deleteBtn).addEventListener('click',
      itemDeleteSubmit);

      //Back button event
      document.querySelector(UISelectors.backBtn).addEventListener('click',
      UICtrl.clearEditState);
      
      //clear button event
      document.querySelector(UISelectors.clearBtn).addEventListener('click',
      clearAllItemsClick);


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
                
            //Store in LS
            StorageCtrl.storeItem(newItem);
            //Clear fields
            UICtrl.clearInput();
        }
        
        //that's because data is submitted and we want to prevent the page from reload
        e.preventDefault();
    }

    //Item update submit
    const itemUpdateSubmit=function(e){
      // Get item input
      const input = UICtrl.getItemInput();

      // Update item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
      console.log(updatedItem)
      // Update UI
      UICtrl.updateListItem(updatedItem);

      //Get total calories
      const totalCalories=ItemCtrl.getTotalCalories();
      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Update local storage
      StorageCtrl.updateItemStorage(updatedItem);
      //Clear edit state
      UICtrl.clearEditState();
      e.preventDefault()
    }

    //Delete button event
    const itemDeleteSubmit=function(e){

        //Get form input from UI controller
        const currentItem=ItemCtrl.getCurrentItem();        
        
        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        
        // delete from UI
        UICtrl.deleteListItem(currentItem.id);
  
        //Get total calories
        const totalCalories=ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
      
        //Delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Clear edit state
        UICtrl.clearEditState();
      
      e.preventDefault();
      }
  
      //Clear items event
      const clearAllItemsClick=function(){
          
        //Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories=ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();
        
        //Clear from local storage
        StorageCtrl.clearItemsFromStorage();
        //Hide UL
        UICtrl.hideList();
      }

    //Click edit item
    const itemEditClick=function(e){
        
        if(e.target.classList.contains('edit-item')){
            //Get the list item id
            const listId=e.target.parentNode.parentNode.id;
           
            //Break into an array (item...)
            const listIdArr=listId.split('-');
            console.log(e.target.parentNode.parentNode.id)
            //Get the actual id
            const id=parseInt(listIdArr[1]);
            console.log(id)
            //Get item
            const itemToEdit=ItemCtrl.getItemById(id);
            console.log(itemToEdit)
            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            console.log(ItemCtrl.getCurrentItem())
            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }
    //Public methods
  return {
    init: function(){
      // Clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl,UICtrl,StorageCtrl);

//Initalizing App
AppCtrl.init();


