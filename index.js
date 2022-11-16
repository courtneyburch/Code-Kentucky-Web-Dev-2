const express = require('express');
const app = express();

nunjucks = require('nunjucks')
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');  

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))  // serve static file

const Animal = require('./modules/Animal.js');

app.get('/', function(req, res) {   // open welcome page
	res.render('home', { title: 'homepage' }); 
});

app.get('/showAll', function(req, res) {   // GET request from link in nav bar
					  
	Animal.find( function(err, allAnimals) {   
		if (err) {
		    res.render('resultpage', {result : err});   
		}
		else {
		    if (allAnimals.length == 0) {  // allTrips array was empty
			   res.render('resultpage', {result : 'No animals found.'});   
		    }
		    else {
			   	res.render('showAll', { trips: allAnimals });  
		    }
		}
	});
    
});

app.use('/addAnimal', function(req, res){  // recieves GET and POST for same route 
  
	if(req.method == "GET") {
		res.render('addAnimalForm', {title: 'Add an Animal'});
	}
	else if(req.method == "POST") {
	    let newAnimal = new Animal({        // create new animal object
            type: req.body.type,
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age,
            coloring: req.body.coloring,
            
	    });

	    newAnimal.save( function(err) {      // save new trip
		    if (err) {
		    	res.render('resultpage', {result : 'Error ' + err});  
		    }
		    else {
		        res.render('resultpage', {title: 'add annimal', result : 'New animal has been added'});   
		    }
	    }); 
	}

});


app.listen(3000,  function() {
	console.log('Listening on port 3000, ctrl-c to quit');
    });


