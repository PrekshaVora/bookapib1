// Initializing Express Router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
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
Router.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

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
Router.get("/c/:category", async (req, res) => {
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
Router.get("/a/:authorid",(req,res) => {
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
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;

    await BookModel.create(newBook);

    return res.json({ message: "book was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true, // to get updated data
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.bookTitle;
  //     return;
  //   }
  // });

  return res.json({ books: updatedBook });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/author/update/:isbn", async (req, res) => {
  // update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn)
  //     return book.authors.push(req.body.newAuthor);
  // });

  // update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  // database.authors.forEach((author) => {
  //   if (author.id === req.body.newAuthor)
  //     return author.books.push(req.params.isbn);
  // });

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added 🚀",
  });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  // const updatedBookDatabase = database.books.filter(
  //   (book) => book.ISBN !== req.params.isbn
  // );

  // database.books = updatedBookDatabase;
  return res.json({ books: updatedBookDatabase });
});


module.exports = Router;