require("dotenv").config();
// Frame work
const express = require("express");
const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const publications = require("./API/Publication");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

console.log(process.env.MONGO_URL);

// Establish Database Connection
mongoose.connect(
  process.env.MONGO_URL, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
  }
).then(() => console.log("Connection established!!"));

//Initializing Microservices
shapeAI.use("/book",Books);


//Initialize MicroServices
shapeAI.use("/book",Books);
shapeAI.use("/author",Authors);
shapeAI.use("/publication",publications);


shapeAI.listen(3000, () => console.log("Server running!!😎"));