const form=document.getElementById("loan-form").addEventListener('submit',calc);


function calc(e){

    console.log('calculating...');

    //UI Vars bab
    const amount=document.getElementById('amount');
    const interest=document.getElementById('interest');
    const years=document.getElementById('years');
    const monthlyPayment=document.getElementById("monthly-payment");
    const totalPayment=document.getElementById("total-payment");
    const totalInterest=document.getElementById("total-interest");
     
    const principal=parseFloat(amount.value);
    const calculatedInterest=parseFloat(interest.value)/10/12;
    const calculatedPayments=parseFloat(years.value)*12;
        
    //Compute monthly payment
    const x=Math.pow(1+calculatedInterest,calculatedPayments);
    const monthly=(principal*x*calculatedInterest)/(x-1);

    if(isFinite(monthly)){
        monthlyPayment.value=monthly.toFixed(2);
        totalPayment.value=(monthly*calculatedPayments).toFixed(2);
        totalInterest.value=((monthly*calculatedPayments)-principal).toFixed(2);
        
    }else{//not finite- the user didn't insert enough info
        //we build a custom function to show the error in the UI
        showError("Insert more values");
    }

    e.preventDefault();

}

function showError(error){

    //get elements
    const card=document.querySelector(".card");
    const heading=document.querySelector(".heading");

    //create a div
    const errorDiv=document.createElement('div');

    //add class
    errorDiv.className='alert alert-danger';

    //create text node and append to div
    errorDiv.appendChild(document.createTextNode(error));

    //Insert error above heading
    card.insertBefore(errorDiv,heading);

    //Clear error after 3 seconds
    setTimeout(clearError,3000);
}

function clearError(){

    //Grab the element with class 'alert' and remove it
    document.querySelector('.alert').remove();
}

    // if(amount.value===''){
    //     alert('Add loan amount');
    // }
    // if(interest.value===''){
    //     alert('Add Interest Input');
    // }
    // if(years.value===''){
    //     alert('Add Years Input');
    // }
    // console.log('calculating...')

    