var express = require('express');
var app = express();
var path = require('path');
var port = 3000; // change to env var

// start the server
app.listen(port, function() {
  console.log('app started');
});

app.use(express.static(path.join(__dirname, '../public')));

// route our app
app.get('/', function(req, res) {
  res.send('hello world!');
});

// use for 404 errors
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
