const db = require('../models')
const Book = db.book
const Op = db.Sequelize.Op

// Create and Save a new Book
exports.create = async (req, res) => {
    // Check if title and author are provided
    if (!req.body.title || !req.body.author) {
      return res.status(400).send({
        message: 'Title and author cannot be empty!'
      });
    }
  
    // Define the book object from the request body
    const book = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      publishedYear: req.body.publishedYear
    };
  
    try {
      // Check if a book with the same title and author already exists
      const existingBook = await Book.findOne({
        where: {
          title: book.title,
          author: book.author
        }
      });
  
      if (existingBook) {
        // If the book exists, send a conflict response
        return res.status(409).send({
          message: 'A book with the same title and author already exists.'
        });
      }
  
      // If the book does not exist, create a new book
      const newBook = await Book.create(book);
  
      // Send the newly created book as a response
      res.send(newBook);
    } catch (err) {
      // Handle any errors that occurred during the process
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.'
      });
    }
  }

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  const { title, author, genre, sort, order = 'ASC' } = req.query;
  let condition = {};

  if (title) {
    condition.title = { [Op.like]: `%${title}%` };
  }
  if (author) {
    condition.author = { [Op.like]: `%${author}%` };
  }
  if (genre) {
    condition.genre = { [Op.like]: `%${genre}%` };
  }

  let orderCondition = [];
  if (sort) {
    orderCondition = [[sort, order.toUpperCase()]];
  }

  Book.findAll({
    where: condition,
    order: orderCondition
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving books.'
      });
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Book with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Book with id=' + id
      });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Book.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Book was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Book with id=' + id
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Book.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Book was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Book with id=' + id
      });
    });
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  Book.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Books were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all books.'
      });
    });
};
