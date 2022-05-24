const { books } = require("./books.json");

class BooksAPI {
  getAllBooks() {
    return books;
  }

  getBook(isbn) {
    return books.find((book) => book.isbn === isbn);
  }
}

module.exports = BooksAPI;
