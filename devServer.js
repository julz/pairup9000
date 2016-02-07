var path = require('path');
var app = require('./app');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var http = require('http').Server(app);
var bodyParser = require('body-parser')
var compiler = webpack(config);

app.use(bodyParser.json())

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

var assignments = {};

app.post("/state.json", function(req, res) {
  console.log("recieved", req.body)
  assignments = req.body
  res.end("OK")
});

app.get("/state.json", function(req, res) {
  console.log("replying", assignments)
  res.end(JSON.stringify(assignments))
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
