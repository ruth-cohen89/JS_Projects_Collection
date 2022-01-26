// //Init gitHub
// const gitHub=new GitHub;
// //Init ui
// const ui=new UI;

function* generator(array){
    for(let i=0; i<array.length; i++){
yield array[i]
    }
}

const genObject= generator([1,2,3]);
console.log(genObject.next());	//{value: 1, done: false}
console.log(genObject.next());
