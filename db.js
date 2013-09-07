var mongodb = require('mongodb');
var Q = require('q');
var uuid = require('uuid');

var MONGO_CONNECT_STR = 'mongodb://127.0.0.1:27017/zhvoc';

var insertOneWord = function (collection, word) {
  var deferred = Q.defer();
  var randomNumber = Math.floor(10000000 * Math.random());

  collection.insert({
    word: word,
    rand: randomNumber,
    isWord: null
  }, function (err) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};


exports.insertVocabulary = function (vocabulary) {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    var deferred = Q.defer();

    var collection = db.collection('vocabulary');
    return vocabulary.reduce(function (lastPromise, word) {
      return lastPromise.then(function () {
        return insertOneWord(collection, word);
      })
    }, Q()).fin(function () {
      db.close();
    });
  });
};

exports.createAndInsertUser = function () {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    var userUUID = uuid.v4();
    console.log(userUUID);
    var collection = db.collection('user');
    return Q.ninvoke(collection, "insert", {"_id": userUUID}).fin(function () {
      db.close();
    }).then(function () {
      return userUUID;
    });
  });
};

exports.userExists = function (userUUID) {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    return Q.ninvoke(db.collection('user'), "findOne", {"_id": userUUID}).then(function (result) {
      return result? true: false;
    }).fin(function (){
      db.close();
    });
  });
};

exports.setIsWord = function (word, isWord) {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    return Q.ninvoke(db.collection('vocabulary'), "findOne", {"word": word}).then(function (wordObject) {
      if (!wordObject) throw new Error('word not exists');
      wordObject["isWord"] = isWord;
      return Q.ninvoke(db.collection('vocabulary'), "update", {"_id": wordObject['_id']}, wordObject);
    }).fin(function () {
      db.close();
    });
  });
};

exports.getUncheckedWords = function () {  
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    var randomNumber = Math.floor(10000000 * Math.random());
    return Q.ninvoke(db.collection('vocabulary').find({
      "isWord": null, 
      "rand": {"$gte": randomNumber}
    }).limit(20), "toArray").then(function (items) {
      return items.map(function (item) {
        return item['word'];
      });
    }).fin(function () {
      db.close();
    });
  });
};

exports.updateLog = function (ip, userUUID, word, isWord) {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    var logObject = {
      "ip": ip,
      "timestamp": new Date().getTime(),
      "uuid": userUUID,
      "word": word,
      "isWord": isWord
    };
    return Q.ninvoke(db.collection('log'), "insert", logObject).fin(function () {
      db.close();
    });
  });  
}

exports.recentLog = function () {
  return Q.nfcall(mongodb.MongoClient.connect, MONGO_CONNECT_STR).then(function (db) {
    return Q.ninvoke(db.collection('log').find().sort({"timestamp": -1}).limit(10), "toArray").then(function (recentLogs) {
      return recentLogs.map(function (log) {
        return {
          "word": log['word'],
          "isWord": log['isWord'],
          "timestamp": log['timestamp']
        };
      });
    }).fin(function () {
      db.close();
    });
  }); 
};
