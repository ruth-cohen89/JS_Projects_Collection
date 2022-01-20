//Constructor
function EventObserver(){
    this.observers=[];
}

EventObserver.prototype={

    subscribe: function(fn){
        this.observers.push(fn);
        console.log(`Subscribed to ${fn.name}`)
    },

    //Filter what matches the callback function
    unsubscribe: function(fn){
        this.observers=this.observers.filter((item)=>{
            if(item!==fn){
                return item;
            }
        });
        console.log(`Unsubscribed to ${fn.name}`)
    },
    fire: function(){
        this.observers.forEach((item)=>{
            item.call();
        })
    }
}

const click=new EventObserver();

//Event listeners
document.querySelector('.sub-ms').addEventListener('click',()=>{
    click.subscribe(getCurMilliseconds);
});

document.querySelector('.unSub-ms').addEventListener('click',()=>{
    click.unsubscribe(getCurMilliseconds);

});
document.querySelector('.sub-s').addEventListener('click',()=>{
    click.subscribe(getCurSeconds);
});

document.querySelector('.unSub-s').addEventListener('click',()=>{
    click.unsubscribe(getCurSeconds);

});

document.querySelector('.fire').addEventListener('click',()=>{
    click.fire();
});

//Click handlers, (the user can subscribe or an subscribe to this 'service')
const getCurMilliseconds=()=>{
    console.log(`current milliseconds: ${new Date().getMilliseconds()}`);
}

const getCurSeconds=()=>{
    console.log(`current seconds: ${new Date().getSeconds()}`);
}