// define express app
let express = require('express');
let app = express();

// set up mysql
let mysql = require('mysql');
let pool = mysql.createPool({
    host            : 'localhost',
    user            : 'student',
    password        : 'default',
    database        : 'student'
});

// initialize dependencies
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

// set up handlers for POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set up templating system for displaying content
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/reset-table',function(req,res,next){
  let context = {};
  mysql.query("DROP TABLE IF EXISTS workouts", function(err){
    let createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    });
  });
});

// error handling
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

// notifications
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
