module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      }
    });
  
    return User;
  }
  