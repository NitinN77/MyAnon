const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')

const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose.connect('mongodb://0.0.0.0:27017/myanondb', {
   useNewUrlParser: true,
   useUnifiedTopology: true
}, (err) => {
   if (!err) {
      console.log('MongoDB Connection Succeeded.')
   } else {
      console.error('Error in DB connection: ' + err)
   }
});

app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)

app.get('/', (req, res) => {
    res.json({message: "404 Page Not Found"})
})

app.listen(port, () => console.log(`Listening on port ${port}`))