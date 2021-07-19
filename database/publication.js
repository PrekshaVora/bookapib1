const mongoose = require("mongoose");

//Publication schema
const PublicationSchema  = mongoose.Schema({
    
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

//Publication Model
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;