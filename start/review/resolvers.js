const resolvers = {
  Query: {
    reviews(_, __, { dataSources }) {
      return dataSources.reviewsAPI.getAllReviews();
    },
  },
};

module.exports = resolvers;
