const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  }, // required
  title: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  authors:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  language:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  pubDate:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  numOfPage:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  category:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  publication:  {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;