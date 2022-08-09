var express = require('express');
var router = express.Router();

//import Book model
const Book = require('../models').Book;

/* GET home page. */
// router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
// router.get('/', asyncHandler(async (req, res) => {
  // book = await book.findAll({ order: [["createdAt", "DESC"]] });
// router.get('/', (req, res, next) {
//   res.redirect("/books");
//   // })
// });

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET book listing. */
// get / - Home route should redirect to the /books route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect("/books");
  })
);

// get /books - Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
  })
);

//*****
// get /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
  })
);

// post /books/new - Posts a new book to the db
// router.post('/books/new', function(req, res, next) {s
// router.post('/books/new', asyncHandler(async (req, res) => {
//   Book.create(req.body).then(function(book) {
//     res.redirect("/books");
//   });
// }));
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    // res.redirect("/books/" + book.id);
    res.redirect("/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      // res.render("books/new", { book, errors: error.errors, title: "New Book" })
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

// get /books/id - Shows book detail form
// router.get("books/:id", function(req, res, next){
//   Book.findByPk(req.params.id).then(function(book){
//     res.render("books/show", {book: book, title: book.title});
//   });
// });
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  if(book) {
    res.render("update-book", { book, title: "Update Book" });  
  } else {
    // res.sendStatus(404);
    const err = new Error();
    err.status = 404;
    res.render("page-not-found", { err });
  }
}));

//
// post /books/id - Updates book info in the db
// router.post('/:id', function(req, res, next){
//   Book.findByPk(req.params.id).then(function(book) {
//     return book.update(req.body);
//   }).then(function(book){
//     res.redirect("/books/" + book.id);    
//   });
// });
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.render('page-not-found');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

//
// post /books/id/delete - Deletes a book..cant undo, helpful to create a new "test" book to test deleting
// router.post('/book/:id/delete', function(req, res, next){
//   book.findByPk(req.params.id).then(function(book) {
//     return book.destroy();
//   }).then(function(){
//     res.redirect("/books");
//   });
// });
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    // res.sendStatus(404);
    throw error;
  }
}));

module.exports = router;
