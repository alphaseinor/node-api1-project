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

//Find all users
server.get("/api/users", (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({errorMessage: "The users information could not be retrieved."})
  })
})

//Find user by ID
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

//Add a new user
server.post('/api/users', (req, res) => {
  const user = req.body
  if(user.name && user.bio){ 
    db.insert(user)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }) 
  }else{
    res.status(400).json({errorMessage: "Please provide name and bio for the user."})
  }
})

server.delete('/api/users/:id', (req, res) => {
  const {id} = req.params

  db.remove(id)
  .then(deleted => {
    deleted ? res.status(204).end() : res.status(404).json({message: "The user with the specified ID does not exist."})
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "The user could not be removed" })
  })
})

server.put('/api/users/:id', (req, res) => {
  const {id} = req.params
  const userChange = req.body

  db.findById(id)
  .then(exists => {
    if (!exists){  
    res.status(404).json({message: "The user with the specified ID does not exist."})}else if(userChange.name && userChange.bio){ 
      db.update(id, userChange)
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
      }) 
    }else{
      res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }
  })
  .catch(err => {
    res.status(404).json({message: "The user with the specified ID does not exist."})
  })
})