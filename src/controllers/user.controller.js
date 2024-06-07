const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt.utils');

// Create and Save a new User
exports.create = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.'
      });
    });
};

exports.findAll = (req, res) => {
  const { name, email, sort, order = 'ASC', and, or } = req.query;
  let condition = {};

  if (and) {
    const andConditions = JSON.parse(and).map(cond => {
      const key = Object.keys(cond)[0];
      return { [key]: { [Op.like]: `%${cond[key]}%` } };
    });
    condition = { [Op.and]: andConditions };
  } else if (or) {
    const orConditions = JSON.parse(or).map(cond => {
      const key = Object.keys(cond)[0];
      return { [key]: { [Op.like]: `%${cond[key]}%` } };
    });
    condition = { [Op.or]: orConditions };
  } else {
    if (name) {
      condition.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      condition.email = { [Op.like]: `%${email}%` };
    }
  }

  let orderCondition = [];
  if (sort) {
    orderCondition = [[sort, order.toUpperCase()]];
  }

  User.findAll({
    where: condition,
    order: orderCondition
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving User with id=' + id
      });
    });
};

exports.updatePassword = (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).send({
      message: 'Password cannot be empty!'
    });
  }

  User.update({ password }, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User password was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating User with id=' + id
      });
    });
};

exports.updateUserDetails = (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).send({
      message: 'At least one field (name or email) must be provided!'
    });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  User.update(updateData, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User details were updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating User with id=' + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id
      });
    });
};

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all users.'
      });
    });
};

exports.register = (req, res) => {
  // Check if all required fields are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  // Check if the user already exists
  User.findOne({
    where: { email: req.body.email },
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: 'User already exists!',
      });
    } else {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role || 'user',
      };

      User.create(newUser)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'Some error occurred while creating the User.',
          });
        });
    }
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while checking for existing User.',
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    where: { email: email },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found!',
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          message: 'Invalid Password!',
        });
      }

      const token = generateToken(user);

      res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while logging in.',
      });
    });
};