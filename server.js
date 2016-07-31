var thataway = require('./')
var express = require('express')
var app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(function(req, res, next) {
  res.blap = function(state) {
    state = state || {}
    state.path = req.path
    thataway(state)
    state.initialState = JSON.stringify(state)
    res.render('wrapper', state)
  }
  next()
})

app.get('/', function(req, res) {
  res.blap({title:'HEYO', next:'/a'})
})

app.get('/a', function(req, res) {
  res.blap({title:'FOMO', next:'/b'})
})

app.get('/b', function(req, res) {
  res.blap({title:'YOLO', next:'/c'})
})

app.get('/c', function(req, res) {
  res.blap({title:'NOPE', next:'/'})
})

app.listen(3000, function() {
  console.log('listening on port 3000')
})
