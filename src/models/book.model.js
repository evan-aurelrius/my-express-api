module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('book', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING
      },
      publishedYear: {
        type: Sequelize.INTEGER
      }
    }, {
      defaultScope: {
        order: [['id', 'DESC']]
      }
    });
  
    return Book;
  }