const Router = require("express").Router();

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", (req, res) => {
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
  Route           /publication/update/book
  Description     update/add new book to a publication
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */
Router.put("/update/book/:isbn", (req, res) => {
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
  Route           /publication/delete/book
  Description     delete a book from publication 
  Access          PUBLIC
  Parameters      isbn, publication id
  Method          DELETE
  */
Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
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
  


module.exports = Router;