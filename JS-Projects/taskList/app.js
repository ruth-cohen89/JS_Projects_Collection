//Define UI Vars

const form = document.querySelector('#task-form');
const taskList=document.querySelector('.collection');
const clearBtn=document.querySelector('.clear-tasks');
const filter=document.querySelector('#filter');
const taskInput=document.querySelector('#task');

//Call Load event listeners
loadEventListeners();

 //create Load event listeners
function loadEventListeners(){

    //DOM Load event, after DOM is loaded present all in the UI
    document.addEventListener('DOMContentLoaded', getTasks);

    //add task event
    form.addEventListener('submit', addTask);

    //remove task event
    taskList.addEventListener('click',removeTask)

    //Clear task event
    clearBtn.addEventListener('click', clearTasks)

    //filter tasks event
    filter.addEventListener('keyup',filterTasks);
}

//Get tasks from LS to the UI
function getTasks(){
    let tasks;
    if(localStorage.getItem('tasks')===null){
        tasks=[];
    } else {
        tasks=JSON.parse(localStorage.getItem('tasks'));   
    }

    tasks.forEach(function(task){
    //create li
    const li=document.createElement('li');
    li.className='collection-item';

    //append task to li
    li.appendChild(document.createTextNode(task));
    
    //create link
    const link=document.createElement('a');

    //secondary content is of this framework, its X
    link.className='delete-item secondary-content';

    //moves the x to the right
    link.innerHTML='<i class="fa fa-remove"></i>';

    //append link to li
    li.appendChild(link);

    //append li to UL
    taskList.appendChild(li);
    
    })

}

function addTask(e){
    if(taskInput.value===''){//value is what the user inserted
        alert('Add a task');
    }

    //create li
    const li=document.createElement('li');
    li.className='collection-item';

    //append task to li
    li.appendChild(document.createTextNode(taskInput.value));
    
    //create link
    const link=document.createElement('a');

    //secondary content is of this framework, its X
    link.className='delete-item secondary-content';

    //moves the x to the right
    link.innerHTML='<i class="fa fa-remove"></i>';

    //append link to li
    li.appendChild(link);

    //append li to UL
    taskList.appendChild(li);

    //store in LS
    storeTaskInLocalStorage(taskInput.value);


    //Clear input
    taskInput.value='';

    e.preventDefault();
} 

//Store task
function storeTaskInLocalStorage(task){
    let tasks;
    if(localStorage.getItem('tasks')===null){
        tasks=[];
    }
    else{
        tasks=JSON.parse(localStorage.getItem('tasks'));   
    }

    tasks.push(task);

    localStorage.setItem('tasks',JSON.stringify(tasks));
}

//Remove task
function removeTask(e){

    //check if user click on the X,, check if the parent is delete class
    if(e.target.parentElement.classList.contains

            ('delete-item')){//target and delete the li
                if(confirm('Are You Sure?'))
                e.target.parentElement.parentElement.remove();
            
                //Remove from LS
                removeTaskFromLocalStorage
                (e.target.parentElement.parentElement);
            }

}

//Remove from LS
function removeTaskFromLocalStorage(taskItem){
    
    let tasks;
    if(localStorage.getItem('tasks')===null){
        tasks=[];
    }
    else{
        tasks=JSON.parse(localStorage.getItem('tasks'));   
    }
    tasks.forEach(function(task, index){
        //check where it is 
        if(taskItem.textContent===task){
            tasks.splice(index,1);
        }
    });

    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function clearTasks(e){
   //optional: taskList.innerHTML='';

   //faster:
   while(taskList.firstChild){
       taskList.removeChild(taskList.firstChild);
   }

   //Clear from LS
   clearTasksFromLocalStorage();
}

//Clear Tasks from LS
function clearTasksFromLocalStorage(){
    localStorage.clear();
}

//Filter Tasks
function filterTasks(e){
    const text=e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach
    (function(task){
        const item=task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text)!=-1){//if its equal
            task.style.display='block';
        } else{
            task.style.display='none';
        }
    })
}