// Book Constructor
function Book(title, author, isbn){
    this.title=title;
    this.author=author;
    this.isbn=isbn;
}

//UI Constructor
function UI() {}

//Add a function to prototype of UI- Add book to list
UI.prototype.addBookToList=function(book){
    const list = document.getElementById('book-list');
    //create tr element
    const row=document.createElement('tr');
    //Insert cols
    row.innerHTML= `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td><a href="#" class="delete">X<a></td>
    `;

    list.appendChild(row);
}

UI.prototype.clearFields=function(){
    document.getElementById('title').value="";
    document.getElementById('author').value="";
    document.getElementById('isbn').value="";
}

//Event Listener
document.getElementById('book-form').addEventListener('submit',function(e){
    //Get form values
    const title=document.getElementById('title').value;
          author=document.getElementById('author').value;
          isbn=document.getElementById('isbn').value;
    
    //Instantiate book
    const book= new Book(title,author,isbn);

    //Instantiate a UI object
    const ui= new UI();

    //Validate
    if(title===''|| author===''||isbn===''){
        alert('Failed');
    }else{
    //Add book to list
    ui.addBookToList(book);

    //Clear fields
    ui.clearFields();
    }

    e.preventDefault();
});

function setMessage(msg,color){
    //create a div
    const msgDiv=document.createElement('div');
    //add a class to div
    msgDiv.className="alert alert-danger "
    //create text node &append to div
    msgDiv.appendChild(document.createTextNode(msg));

    //Insert div before h1
    //card.insertBefore(msgDiv,title);
}
