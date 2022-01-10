/*
GAME FUNCTION:
- Player must guess a number between a min and max
- Player gets a certain amount of guesses
- Notify player of guesses remaining
- Notify the player of the correct answer if loose
- Let player choose to play again
*/
//Game values
let min=1,
    max=10,
    winningNum=getRandomNum(min,max), 
    guessesLeft=3;
    console.log(winningNum);
//UI vars
const game=document.querySelector("#game");
      minNum=document.querySelector(".min-num");
      maxNum=document.querySelector(".max-num");
      guessBtn=document.querySelector("#guess-btn");
      guessInput=document.querySelector("#guess-input");
      message = document.querySelector('.message');
//Assign UI min and max
minNum.textContent=min;
maxNum.textContent=max;

//Play again event listener
game.addEventListener('mousedown',function(e){
    if(e.target.className==="play again"){
        window.location.reload();
    }
});

//Listen for guess
guessBtn.addEventListener('click',function(){

    let guess=parseInt(guessInput.value);
    console.log(guessInput.value)
    //validate
    if (isNaN(guess)||guess<min||guess>max){
        setMessage(`Please enter a number between ${min} and ${max}`,'red');
    }else{

    //Check if won
    if(guess===winningNum){
        gameOver(true,`${winningNum} is correct! YOU WIN`);

    }else{
        //Wrong number
        guessesLeft-=1;

        //If no guesses left
        if(guessesLeft===0){
        //Game over-lost
        gameOver(false,`Game Over, you lost. The correct answer was ${winningNum}`);

        } else {
        //Game continues - wrong answer
        
        //Clear input
        guessInput.value= '';
        
        //Set border color
        guessInput.style.borderColor='red';
        setMessage(`${guess} is not correct, ${guessesLeft} guesses left`,'red');
        }
    }
    }
});

function setMessage(msg, color){
    message.style.color=color;
    message.textContent=msg;
}

function getRandomNum(min,max){
    return (Math.floor(Math.random()*(max-1+1)+min));
}

function gameOver(won,msg){
    let color;
    //check if won
    won===true?color='green':color='red';

    //Disable input
    guessInput.disabled=true;

    //Change border color
    guessInput.style.borderColor=color;

    //Change text color
    message.style.color=color;

    //Set message
    setMessage(msg,color);  
    //Play again
    guessBtn.value="PLAY AGAIN";
    guessBtn.className+="play again";
}




