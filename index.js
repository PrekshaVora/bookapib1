require("dotenv").config();
// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});
/*
Route           /is
Description     get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  // value -> true

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});
/*
Route           /c
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/
shapeAI.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.findOne({
    category: req.params.category,
  });

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});

/*
Route         /a/
Description   get specific  books based on author  
Access        public
Parameters    isbn-(Books isbn in author's data)
Method        get
*/
shapeAI.get("/a/:authorid",(req,res) => {
  const getSpecificBook = database.authors.filter(
      (author) => author.books.includes(req.params.authorid)
  );
  if(getSpecificBook.length ==0){
      return res.json({
          error:`No Author found for the Book of ${req.params.authorid}`,
      });
  }
  return res.json({book: getSpecificBook});
 });

/*
Route            /author
Description     get all authors
Access           PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/author", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors:getAllAuthors});
});

/*
Route           /author
Description     get specific authors
Access          PUBLIC
Parameters      author
Method          GET
*/
shapeAI.get("/author", (req, res) => {
    const getSpecificauthors = database.authors.filter((author) =>
      author.book.includes(req.params.authors)
    );
  
    if (getSpecificauthors.length === 0) {
      return res.json({
        error: `No book found for the author of ${req.params.author}`,
      });
    }
  
    return res.json({ authors: getSpecificauthorss });
  });
  


/*
Route           /author
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/author/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
  });

  /*
Route           /publication
Description     get specific publication
Access          PUBLIC
Parameters      publication
Method          GET
*/
shapeAI.get("/publication", (req, res) => {
  const getSpecificpublications = database.publications.filter((publications) =>
    publications.books.includes(req.params.publications)
  );

  if (getSpecificpublications.length === 0) {
    return res.json({
      error: `No book found for the publication of ${req.params.publications}`,
    });
  }

  return res.json({ publications: getSpecificpublications });
});

/*
Route           /publication
Description     get a list of  publications based on a book ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/publication/:name", (req, res) => {
  const getSpecificpublications = database.publications.filter((publications) =>
    publication.books.includes(req.params.name)
      );

 if (getSpecificpublications.length === 0) {
    return res.json({
      error: `No publication found for the book ${req.params.name}`,
    });
  }

  return res.json({ publications: getSpecificpublications });
});

 /*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/

shapeAI.post("/book/new", async(req , res) =>{
  const {newBook} = req.body;

   BookModel.create(newBook);

  return res.json({message:"book was added!!"})

});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
shapeAI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  
  AuthorModel.create(newAuthor);

  return res.json({  message: "author was added!" });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

shapeAI.post("/publication/new", (req, res) => {
  const { newPublication } = req.body;
  
  PublicationModel.create(newPublication);

  return res.json({ pubnlications: database.publications, message: "publication was added!" });
});

/*
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
    );


  return res.json({ books: database.books 
  });

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/book/author/update/:isbn", async(req, res) => {
  // update the book database
  
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new : true,
    }
    );
  //database.books.forEach((book) => {
    //if (book.ISBN === req.params.isbn)
      //return book.authors.push(req.body.newAuthor);
  //});
  // update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
   },
   {
     $push :{
       books: req.params.isbn,
     },
   },
   {
     new : true,
   }
   );
  //database.authors.forEach((author) => {
    //if (author.id === req.body.newAuthor)
      //return author.books.push(req.params.isbn);
  //});

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added 🚀",
  });
});
/*
Route          /author/update
  Description    Update author name using id
  Access         Public
  Parameters     id
  Method         PUT
 */

  shapeAI.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === req.params.id) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ Authors: database.authors });
 });

/*
  Route          /Publication/update
  Description    Update publication details using id
  Access         Public
  Parameters     id
  Method         PUT
 */

  shapeAI.put("/publication/update/:id", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === req.params.id) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({ Publications: database.publications });
 });


/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
  // update the publication database
  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });
   // update the author database
   database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    message: "author was deleted!!!!!!😪",
    book: database.books,
    author: database.authors,
  });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/author/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.authors = updatedBookDatabase;
  return res.json({ authors: database.authors });
});


/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/publication/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.publications = updatedBookDatabase;
  return res.json({ publications: database.publications });
});




shapeAI.listen(3000, () => console.log("Server running!!😎"));