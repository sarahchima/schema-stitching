const { reviews } = require("./reviews.json");

class reviewsAPI {
  getAllReviews() {
    return reviews;
  }

  getReviewsForBook(isbn) {
    return reviews.filter((review) => review.bookIsbn === isbn);
  }

  addReview(review) {
    const newReview = { id: `rev-${reviews.length + 1}`, ...review };
    reviews = [...reviews, newReview];
    return newReview;
  }
}

module.exports = reviewsAPI;
