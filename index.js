var path = require('path');
var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/';
var mongoDb = 'ballparkTracker';
var mongoCollection = 'parks';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.get('/', (req, res) => res.render('index', { AZURE_MAPS_KEY: process.env.AZURE_MAPS_KEY }));

app.get('/api/parks', (req, res) => {
  mongoClient.connect(mongoUrl, (_err, db) => {
    var dbo = db.db(mongoDb);

    var query = { 'properties.League': 'MLB' };

    dbo.collection(mongoCollection).find(query).toArray(function (_err, result) {
      console.log(result);
      res.json(result);
      db.close();
    });
  });
});

app.put('/api/update', (req, res) => {
  var body = req.body;

  mongoClient.connect(mongoUrl, (_err, db) => {
    var dbo = db.db(mongoDb);

    var query = { 'properties.VenueId': parseInt(body.id) };
    var patch = { $set: { 'properties.Visited': body.visited } };

    dbo.collection(mongoCollection).updateOne(query, patch, (_err, result) => {
      res.status(200);
      db.close();
    });
  });
});

// Configuring static assets (css/js)
app.use(express.static('public'))

app.listen(3000);
