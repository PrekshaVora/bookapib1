const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
Route           /author
Description     get all books based on author
Access          Public
Parameters      isbn
Method          Get
*/ 

Router.get("/:isbn", (req, res) => {
  try {
          const getSpecificAuthors = database.authors.filter(
          (author) => author.books.includes (req.params.isbn)
      );

      if(getSpecificAuthors.length === 0)    {
          return res.json({
              error: `No author found for the Book of ${req.params.isbn}`,
      });
      }

      return res.json({ author: getSpecificAuthors});
  } catch (error) {
      return res.json({ error: error.message});
  }
});

/*
Route           /author
Description     get specific authors
Access          PUBLIC
Parameters      author
Method          GET
*/
Router.get("/author", (req, res) => {
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
Router.get("/:isbn", async (req, res) => {
  try {
    const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthors.length === 0) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }

    return res.json({ authors: getSpecificAuthors });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newAuthor } = req.body;

    await PublicationModel.create(newAuthor);

    return res.json({ message: "author was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/book/author/update/:isbn", async(req, res) => {
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

  Router.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === req.params.id) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ Authors: database.authors });
 });

 /*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/author/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
      (book) => book.ISBN !== req.params.isbn
    );
  
    database.authors = updatedBookDatabase;
    return res.json({ authors: database.authors });
  });
  

module.exports = Router;