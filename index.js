const express = require('express')
const cors = require('cors')
const db = require('./data/db')


const server = express()

server.listen(4000, () => {
  console.log(`Server is listening on http://localhost:4000`)
})

server.use(express.json())

server.get("/", (req, res)=>{
  res.send(`<p>This server has the following functions</p>

  <p>----Create----<br>
  POST<br>
  /api/users<br>
  Creates a user using the information sent inside the request body.</p>
  
  <p>----Read----<br>
  GET<br>
  /api/users<br>
  Returns an array of all the user objects contained in the database.</p>
  
  <p>/api/users/:id<br>
  Returns the user object with the specified id.</p>
  
  <p>----Update----<br>
  PUT<br>
  /api/users/:id<br>
  Updates the user with the specified id using data from the request body.<br>
  Returns the modified document, NOT the original.</p>
  
  <p>----Delete----<br>
  DELETE<br>
  /api/users/:id<br>
  Removes the user with the specified id and returns the deleted user.</p>
  `)
})

server.get("/api/users", (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({errorMessage: "The users information could not be retrieved."})
  })
})

server.get("/api/users/:id", (req, res) => {
  const {id} = req.params

  db.findById(id)
  .then(users => {
    !users ? 
    res.status(404)
    .json({message: "The user with the specified ID does not exist."}) : 
    res.status(200)
    .json(users)
  })
  .catch(err => {
    res.status(500).json({errorMessage: "The user information could not be retrieved."})
  })
})