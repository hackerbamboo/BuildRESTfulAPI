var express = require('express'),
    moments = require('./routes/moments');

var app = express();

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

app.get('/moments', moments.findAll);
app.get('/moments/:id', moments.findById);
app.post('/moments', moments.addMoment);
app.put('/moments/:id', moments.updateMoment);
app.delete('/moments/:id', moments.deleteMoment);

app.listen(3000);
console.log('Listening on port 3000...');