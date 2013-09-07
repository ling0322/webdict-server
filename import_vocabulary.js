var db = require('./db');
var Q = require('q');
var fs = require("q-io/fs");
var S = require('string');


fs.read('dict_test').then(function (content) {
  var lines = S(content).lines();
  return db.insertVocabulary(lines);
}).done();