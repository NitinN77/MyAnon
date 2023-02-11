const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const sls = require('serverless-http')

const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(process.env.DB_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}, (err) => {
   if (!err) {
      console.log('MongoDB Connection Succeeded.')
   } else {
      console.error('Error in DB connection: ' + err)
   }
})

app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)

app.get('/', (req, res) => {
   res.json({ message: "404 Page Not Found" })
})

app.listen(port, () => console.log(`Listening on port ${port}`))

// The line below is used to deploy to AWS Lambda as a serverless app
// module.exports.server = sls(app)