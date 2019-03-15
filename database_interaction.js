// define express app
let express = require('express');
let app = express();

let path = require('path');
let dir = path.join(__dirname, 'public/');
app.use(express.static(dir));

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
app.set('port', 5486);

// this route is called manually (by typing it into the url)
// i don't think this conflicts with any project requirements
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

// called via jquery ajax request
app.post('/insert',function(req,res,next){
  context = {};
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

// main home page
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    console.log(context.results);	
    res.render('home', {data: rows});
  });
});

app.get('/update',function(req,res,next){
    var context = {};   
    res.render('edit',context);
});

// i know that there is a better way to do this then repeating the same code used
// to build the homepage, i just don't have time to look into right now!
app.post('/simple-update',function(req,res,next){   
  var context = {};
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
    [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', {data: rows}); 
  });
});

// same as above, this is not good, but it works (kinda)!
app.get('/delete',function(req,res,next){
  let context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id],
    function(err, result){
    if (err){
      next(err);
      return;
    }
  });
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    console.log(context.results);	
    res.render('home', {data: rows}); 
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
