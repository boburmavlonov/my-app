// Book class: represents a book

class Book {
    constructor(title, author, deadline) {
        this.title = title;
        this.author = author;
        this.deadline = deadline;
    }
}

// UI class: handle UI tasks

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.deadline}</td>
        <td><a href="#" title="Delete" class="btn btn-danger btn-sm delete"><i class="fa fa-times" style="pointer-events:none"></i></td>
        `;

        list.appendChild(row);
    }
    static deleteBook(book) {
        if (book.classList.contains('delete')) {
            book.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `position alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Disappear in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#deadline').value = '';
    }
}

// Store class: handles storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: add a book

function addTheBook(e) {
    // prevent default
    e.preventDefault();
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const deadline = document.querySelector('#deadline').value;

    // Validate
    if (title === '' || author === '' || deadline === '') {
        UI.showAlert('Formalarni bo`sh qoldirmang', 'danger')
    } else {
        // instantiate book
        const book = new Book(title, author, deadline);

        // Add book to list
        UI.addBookToList(book);

        // Show success message
        UI.showAlert('Kitob muvaffaqiyatli qo`shildi!', 'success')

        // Clear fields
        UI.clearFields();

        // Add to localStorage
        Store.addBook(book);
    }
}

document.querySelector('.btn-block').addEventListener('click', (e) => {
    addTheBook(e)
});
document.querySelector('#deadline').addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            addTheBook(e)
        }
    })
    // Event remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove from UI
    UI.deleteBook(e.target);

    // show message
    UI.showAlert('Kitob muvaffaqiyatli o`chirildi', 'info');

    // Remove from Store
    Store.removeBook(e.target.parentElement.parentElement.firstElementChild.innerText)
});

// Dark mode ///

let moonPath = "M12.5 25C12.5 39.0833 24.5 51.6848 25.5096 51.7044C11.4263 51.7044 0.009552 40.2876 0.009552 26.2044C0.009552 12.1211 11.4263 0.704376 25.5096 0.704376C25.5096 0.704376 12.5 10.9167 12.5 25Z";
let sunPath = "M51 25.5C51 39.5833 39.5833 51 25.5 51C11.4167 51 0 39.5833 0 25.5C0 11.4167 11.4167 0 25.5 0C39.5833 0 51 11.4167 51 25.5Z";

let darkMode = document.querySelector('#darkMode');

let h1 = document.querySelector('.mode')

let toggle = false;

// function to change sunColor, sunPath and body
function animate() {
    // use anime.js
    // set up the timeline
    let timeline = anime.timeline({
        duration: 750,
        easing: 'easeOutExpo'
    });
    // add different animation to  the timeline
    timeline
        .add({
            targets: ".sun",
            fill: toggle ? 'rgb(255, 245, 0)' : 'rgb(128, 128, 128)',
            d: toggle ? sunPath : moonPath
        })
        .add({
            targets: '#darkMode',
            rotate: toggle ? 0 : 320
        }, '-=700')
        .add({
            targets: 'body',
            backgroundColor: toggle ? '#fff' : '#343a40',
            color: toggle ? '#000' : '#f8f9fa'
        }, '-=700')
        // Every time we click on the sun I want that the toggle to switch
    if (!toggle) {
        toggle = true;
    } else {
        toggle = false;
    }
}

// Function to change h1 and table background
let trigger = 1;
let table = document.querySelector('table');

function additional() {
    if (trigger === 1) {
        setTimeout(() => {
            h1.innerHTML = 'Light Mode';
            table.classList.add('table-dark');
        }, 300);
        trigger = 0;
    } else {
        setTimeout(() => {
            h1.innerHTML = 'Dark Mode';
            table.classList.remove('table-dark');
        }, 500);
        trigger = 1;
    }
}
darkMode.addEventListener('click', () => {
    animate();
    additional();
});

h1.addEventListener('click', function() {
    animate();
    additional();
})