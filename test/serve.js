const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const sessionId = '123456'
const user = {
  id: '1',
  email: 'wdd@cc.tt',
  password: '000',
  userName: 'wdd',
  isAdmin: true,
  likes: ['reading', 'cooking', 'coding']
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', (req, res, next) => {
  var user = {
    email: 'wdd@cc.tt',
    password: '000'
  }
  if (req.body.email === user.email && req.body.password === user.password) {
    res.status(200).json({sessionId: sessionId}).end()
  } else {
    res.sendStatus(401).end()
  }
})

app.use(function checkSessionId (req, res, next) {
  // console.log('check sessionId')
  // console.log(req.headers)
  if (req.headers.sessionid !== sessionId) {
    res.sendStatus(403)
  } else {
    next()
  }
})

app.get('/users/:id', (req, res, next) => {
  if (req.params.id === user.id) {
    res.json(user)
  } else {
    res.sendStatus(404)
  }
})

app.post('/users', (req, res, next) => {
  res.sendStatus(200)
})

app.put('users/:id', (req, res, next) => {
  if (req.params.id === user.id) {
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

app.delete('users/:id', (req, res, next) => {
  if (req.params.id === user.id) {
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

module.exports = app
