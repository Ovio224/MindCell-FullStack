'use strict';

// modules
const express = require('express');
const jsonParser = require('body-parser').json;
const db = require('./queries');
const morgan = require('morgan');

const app = express();

app.use(jsonParser());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/api/users', db.getUsers);
app.get('/api/friendsOf/:id', db.getFriends);

app.post('/api/users', db.createUser);
app.post('/api/friendsOf/:id', db.addFriend);

app.delete('/api/users/:id', db.deleteUser);
app.delete('/api/friendsOf/:id/:fid', db.deleteFriend);

// set port
app.set('port', process.env.PORT || 5000);

// listening
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
