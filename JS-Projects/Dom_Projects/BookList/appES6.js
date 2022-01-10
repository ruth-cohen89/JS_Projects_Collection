// Book Constructor
class Book{
    constructor (title, author, isbn){
    this.title=title;
    this.author=author;
    this.isbn=isbn;
    }
}

//UI Constructor
//In this version we put the prototype methods inside the class
class UI{

    //Add book to list
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create tr element
        const row=document.createElement('tr');
        //Insert cols
        row.innerHTML= `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X<a></td>
        `;
    
        list.appendChild(row);           
    }
    
    //Delete Book
    deleteBook(target){
    if(target.className==='delete'){
        target.parentElement.parentElement.remove();//a->td->tr
      }
    }

    //Clear fields
    clearFields(){
    document.getElementById('title').value='';
    document.getElementById('author').value='';
    document.getElementById('isbn').value='';
    }

    //Show alert
    showAlert(msg,className){
    //Create div
    const div=document.createElement('div');
    //Add classes
    div.className=`alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(msg));
    //Get parent (when we want to insert an element- we have to insert it before a father's child)
    const container=document.querySelector('.container');
    const form=document.querySelector('#book-form');
    //Insert alert
    container.insertBefore(div, form)
    //TimeOut after 3 sec
    setTimeout(function(){
        document.querySelector('.alert').remove();
       },3000)
    }

}

//Local storage class 
//(When we load the page the data is still there)
class Store{

    //Fetch the books from local storage
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
          books = [];
        } else {
          books = JSON.parse(localStorage.getItem('books'));
        }
    
        return books;
      }

    //Display books of LS in UI
    static displayBooks() {
        const books = Store.getBooks();
    
        books.forEach(function(book){
          const ui  = new UI;
    
          // Add book to UI
          ui.addBookToList(book);
        });
      }

    //Add to local storage
    static addBook(book) {
        const books = Store.getBooks();
    
        books.push(book);
    
        localStorage.setItem('books', JSON.stringify(books));
      }

    static removeBook(isbn){
        const books=Store.getBooks();

        books.forEach(function(book,index){
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//DOM load event 
//(every time the page is loaded the books in LS are updated in the UI)
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listener for adding a book 
document.getElementById('book-form').addEventListener('submit',function(e){
    //Get form values
    const title=document.getElementById('title').value;
          author=document.getElementById('author').value;
          isbn=document.getElementById('isbn').value;
    
    //Instantiate book
    const book= new Book(title,author,isbn);

    //Instantiate UI 
    const ui= new UI();

    //Validate
    if(title===''|| author===''||isbn===''){
    //Error alert
    ui.showAlert('Please fill in all fields', 'error');
    
    } else {
    //Add book to list in UI
    ui.addBookToList(book);
    
    //Add to LS
    //We use the actual className, because its a static method
    Store.addBook(book);

    //Show success
    ui.showAlert('Book Added!', 'success')

    //Clear fields
    ui.clearFields('Please fill on all fields');
    }

    e.preventDefault();
});

//Event listener for deleting
document.getElementById('book-list').addEventListener('click',function(e){
    //Instantiate the UI (In order to use its prototype methods)
    const ui=new UI();

    //Delete book
    ui.deleteBook(e.target);

    //Remove from LS, argument is isbn
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show alert
    ui.showAlert('Book removed!', 'success');
     
    e.preventDefault();
});
