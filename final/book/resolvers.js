const resolvers = {
  Query: {
    books(_, __, { dataSources }) {
      return dataSources.booksAPI.getAllBooks();
    },
    book(_, { isbn }, { dataSources }) {
      return dataSources.booksAPI.getBook(isbn);
    },
  },
};

module.exports = resolvers;
