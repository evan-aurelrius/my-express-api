const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const db = require('./models')
db.sequelize.sync()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const userRoutes = require('./routes/user.routes')
const bookRoutes = require('./routes/book.routes')

app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my express API application.' });
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
