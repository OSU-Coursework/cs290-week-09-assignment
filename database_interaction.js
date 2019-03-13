// define express app
let express = require('express');
let app = express();

// set up mysql
let mysql = require('./dbcon.js');

// initialize dependencies
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

// set up handlers for POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set up templating system for displaying content
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5485);

app.get('/reset-table',function(req,res,next){
  let context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    let createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    });
  });
});

// some form of this will probably be used to put data into the database
app.post('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

// some form of this will probably be used to loop through and select the data to display
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    console.log(context);	
    res.render('home', context);
  });
});

// some form of this will probably be used with the edit button to change a row
app.get('/simple-update',function(req,res,next){   
  var context = {};
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

// will have to write a delete too to have the data removed
app.get('/delete',function(req,res,next){
  let context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id],
    function(err, result){
    if (err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context); 
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
