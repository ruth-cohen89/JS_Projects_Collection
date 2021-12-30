const form=document.getElementById('weight-form').addEventListener('submit',function(e){

    document.getElementById('loading').style.display="block";

    setTimeout(calculate,2000);
    e.preventDefault()
});

function calculate(){
     //UI Vars baby
     document.getElementById('loading').style.display="none";
     const kg=document.getElementById('kg');
     const lb=document.getElementById('lb');

     const KG=parseFloat(kg.value);
     const result=KG*2.205;
     if (isFinite(result)){
        lb.value=result.toFixed(1);;
     }else{
         showError("please insert a number");
     }
     

}

function showError(error){

    //get elements
    const card=document.querySelector('.card');
    const h1=document.querySelector('.heading');

    //create a div
    const errDiv=document.createElement('div');

    //add a class to div
    errDiv.className="alert alert-danger "
    //create text node &append to div
    errDiv.appendChild(document.createTextNode(error));

    //Insert div before h1
    card.insertBefore(errDiv,h1);

    setTimeout(clearError,2000);

}

function clearError(){
    document.querySelector('.alert').remove();
}