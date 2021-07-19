const mongoose = require("mongoose");

//Author schema
const AuthorSchema  = mongoose.Schema({
    
    id:  {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
      },
        name:  {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 10,
          },
    books:  {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
      },
});

//Author Model
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;