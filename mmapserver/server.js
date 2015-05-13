// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); 
var app = express();

// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
});

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/sendLocation', function(request, response) 
{
    var lat = parseFloat(request.body.lat);
    var lng = parseFloat(request.body.lng);
    var login = request.body.login;
    var now = new Date();
    var data_err = { "error": "Whoops, something is wrong with your data!" };

    var sanitize = function(str) {
        var sanitized_str = str.replace(/[^a-zA-z\d _-]/g,"");
        sanitized_str = sanitized_str.trim();
        return sanitized_str;
    };
    
    if (!login) {
        response.send(data_err);
    } else {
        var san_login = sanitize(login);
        if (login != san_login) {
            response.send(data_err);
        } else {
            var toInsert = {
                "login": san_login, "lat": lat, "lng": lng, "created_at": now.toISOString()
            };

            db.collection('locations', function(er, collection) {
                if (er || !lat || !lng || !san_login) {
                    response.send(data_err);
                } else {
                    var id = collection.update(
                        { login: san_login },   // query
                        { $set: toInsert }, // update only selected fields
                        { upsert: true },   // create document if none matches query
                    function(err, saved) { 
                        if (err) {
                            response.send(data_err);
                        } else {
                            collection.find().toArray(function(arr_error, cursor) {
                                if (arr_error) {
                                    response.send(data_err);
                                } else {
                                    response.send(cursor);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
});

app.get('/location.json', function(request, response)
{
    response.set('Content-Type', 'application/json');
    var lgn = request.query.login;

    if (!lgn || (typeof user != "string")) {
        response.send({});
    } else {
        db.collection('locations', function(er, collection) {
            collection.find({ "login": lgn }).limit(1).toArray(function(err, cursor) {
                if (err || !cursor || cursor.length < 1) {
                    response.send({});
                } else {
                    response.send(cursor[0]);
                }
            });
        });
    }
});

app.get('/', function(request, response) 
{
    response.set('Content-Type', 'text/html');
    var indexPage = '';
    db.collection('locations', function(er, collection) {
        collection.find().sort({created_at: -1}).toArray(function(err, cursor) {
            if (!err) {
                indexPage += "<!DOCTYPE HTML><html><head>";
                indexPage += "<title>Check-ins</title></head>";
                indexPage += "<body><h1>Check-ins</h1>";
                
                for (var count = 0; count < cursor.length; count++) {
                    indexPage += "<p>" + cursor[count].login;
                    indexPage += " checked in at " + cursor[count].lat + ", ";
                    indexPage += cursor[count].lng + " on ";
                    indexPage += cursor[count].created_at + "</p>";
                }
                indexPage += "</body></html>";
                response.send(indexPage);
            } else {
                errorMessage = '<!DOCTYPE HTML><html><head>';
                errorMessage += '<title>Check-ins</title></head><body>';
                errorMessage += '<h1>Whoops, something went terribly wrong!';
                errorMessage += '</h1></body></html>';
                response.send(errorMessage);
            }
        });
    });
});

app.listen(process.env.PORT || 3000);

