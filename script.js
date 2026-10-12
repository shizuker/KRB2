class Book {
    constructor(title, author, isBorrowed = false) {
        this.title = title;
        this.author = author;
        this.isBorrowed = isBorrowed;
    }

    toggleBorrowStatus() {
        this.isBorrowed = !this.isBorrowed;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(title) {
        this.books = this.books.filter(book => book.title !== title);
    }

    findBookByTitle(title) {
        return this.books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    }

    getAvailableBooks() {
        return this.books.filter(book => !book.isBorrowed);
    }

    getStatsByAuthor() {
        const result = {};

        for (let book of this.books) {
            if (result[book.author]) {
                result[book.author]++;
            } else {
                result[book.author] = 1;
            }
        }

        return result;
    }
}

const library = new Library();
library.addBook(new Book("Война и мир", "Лев Толстой"));
library.addBook(new Book("Мастер и Маргарита", "Михаил Булгаков"));
library.addBook(new Book("Преступление и наказание", "Фёдор Достоевский", true));

const form = document.getElementById("bookForm");
const title = document.getElementById("title");
const author = document.getElementById("author");
const search = document.getElementById("search");
const bookList = document.getElementById("bookList");
const stats = document.getElementById("stats");

function showBooks(books = library.books) {
    bookList.innerHTML = "";

    for (let book of books) {
        const item = document.createElement("li");
        const text = document.createElement("span");
        const borrowButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        text.textContent = `${book.title} — ${book.author}`;
        if (book.isBorrowed) {
            text.className = "borrowed";
        }

        borrowButton.textContent = book.isBorrowed ? "Вернуть" : "Взять";
        borrowButton.onclick = function() {
            book.toggleBorrowStatus();
            showBooks();
            showStats();
        };

        deleteButton.textContent = "Удалить";
        deleteButton.onclick = function() {
            library.removeBook(book.title);
            showBooks();
            showStats();
        };

        item.append(text, borrowButton, deleteButton);
        bookList.append(item);
    }
}

function showStats() {
    const data = library.getStatsByAuthor();
    stats.innerHTML = "";

    for (let author in data) {
        stats.innerHTML += `<p>${author}: ${data[author]}</p>`;
    }
}

form.onsubmit = function(event) {
    event.preventDefault();
    library.addBook(new Book(title.value, author.value));
    form.reset();
    showBooks();
    showStats();
};

search.oninput = function() {
    showBooks(library.findBookByTitle(search.value));
};

document.getElementById("availableButton").onclick = function() {
    showBooks(library.getAvailableBooks());
};

document.getElementById("allButton").onclick = function() {
    showBooks();
};

showBooks();
showStats();

