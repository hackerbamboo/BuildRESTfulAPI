var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});
db = new Db('momentdb', server);

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'momentdb' database");
        db.collection('moments', {
            strict: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'moments' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving moment: ' + id);
    db.collection('moments', function(err, collection) {
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('moments', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addMoment = function(req, res) {
    var moment = req.body;
    console.log('Adding moment: ' + JSON.stringify(moment));
    db.collection('moments', function(err, collection) {
        collection.insert(moment, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateMoment = function(req, res) {
    var id = req.params.id;
    var moment = req.body;
    console.log('Updating moment: ' + id);
    console.log(JSON.stringify(moment));
    db.collection('moments', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, moment, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating moment: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(moment);
            }
        });
    });
}

exports.deleteMoment = function(req, res) {
    var id = req.params.id;
    console.log('Deleting moment: ' + id);
    db.collection('moments', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
var populateDB = function() {

    var moments = [{
        time: "March, 1989",
        thing: "Born",
        place: "Chengdu, China",
        feel: "Blessed",
        other: "..."
    }, {
        time: "September, 2013",
        thing: "Come to United States",
        place: "Chicago, U.S",
        feel: "Excited",
        other: "..."
    }];

    db.collection('moments', function(err, collection) {
        collection.insert(moments, {
            safe: true
        }, function(err, result) {});
    });

};