/*
 * GET home page.
 */

var Q = require('q');
var db = require('../db');
require('string-format');

exports.index = function(req, res) {
  Q().then(function () {
    if (!req.cookies['uid']) {
      return db.createAndInsertUser().then(function (userUUID) {
        res.cookie('uid', userUUID, {"expires": new Date(2050, 1, 1)});
        console.log("{} doesn't have an uuid, assign {}".format(req.ip, userUUID));
      });
    }
  }).then(function () {
    return db.getUncheckedWords();
  }).then(function (words) {
    return db.recentLog().then(function (logs) {
      res.render('index', { "words": JSON.stringify(words), "logs": JSON.stringify(logs) });
    });
  }).done();
};

exports.check = function(req, res) {
  var word = req.body.word;
  var isWord = req.body.isWord;
  if (isWord === "true") isWord = true;
  if (isWord === "false") isWord = false;
  if (isWord === "null") isWord = null;
  var uuid = req.cookies['uid']? req.cookies['uid']: 'null';
  db.setIsWord(word, isWord).then(function (words) {
    res.end();
  }).then(function () {
    return db.updateLog(req.ip, uuid, word, isWord);
  }).done();
};

exports.words = function (req, res) {
  db.getUncheckedWords().then(function (words) {
    res.end(JSON.stringify(words));
  }).done();
};

exports.log = function (req, res) {
  db.recentLog().then(function (logs) {
    res.end(JSON.stringify(logs));
  }).done();
};