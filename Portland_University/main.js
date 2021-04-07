var express = require('express');

var app = express();
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 5000);
app.set('mysql', mysql);
app.use('/classes', require('./classes.js'));
app.use('/students', require('./students.js'));
app.use('/professors', require('./professors.js'));
app.use('/majors', require('./majors.js'));
app.use('/enrollments', require('./enrollments.js'));


app.get('/', function(req, res) {
    res.render('home')
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});