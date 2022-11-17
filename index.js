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
		    if (allAnimals.length == 0) {  // array was empty
			   res.render('resultpage', {result : 'No animals found.'});   
		    }
		    else {
			   	res.render('showAll', { animals: allAnimals });  //show all animals in table format
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
            DOB: req.body.dob,
            coloring: req.body.coloring,
            
	    });

	    newAnimal.save( function(err) {      // save new animal
		    if (err) {
		    	res.render('resultpage', {result : 'Error ' + err});  
		    }
		    else {
		        res.render('resultpage', {title: 'add annimal', result : 'New animal has been added'});   
		    } //populate result page with message
	    }); 
	}

});

app.use('/getByName', function(req, res) {   
    if(req.method == "GET") {
		res.render('getAnimalForm', {title: 'Find animal by name'}); // send form
	}
	else if(req.method == "POST") {
		
		let reqName = req.body.name;  // read the name
		
		Animal.find( {name: {'$regex': reqName, $options: 'i'}}, function(err, allByName) {  
			if (err) {
				res.render('resultpage', {result : err});   
			}
			else {
				if (allByName.length == 0) { 
					res.render('resultpage', {result : 'No animal was found with that name.'});   
				} //no animal found with that name
				else {
					res.render('showAll', { animals: allByName });  
				}
			}
		});
	
	}
    
});

app.use('/updateAnimalInfo', function(req, res){
	if(req.method == "GET") {
		let name = req.query.name; //find based on name recieved from form
		Animal.findOne( {name: {'$regex': name, $options: 'i'}}, function(err, myAnimal) { 
			if (err) {
				res.render('resultpage', {result : err});   //no animal found
			}
			else{
				res.render('editAnimalInfo', {title: 'Edit Animal Info', animal: myAnimal}); //populate info
			}
		});
	} else {
		if(req.method == "POST") {
            let updateName = req.body.name;
			let updateType = req.body.type;
			let updateWeight = req.body.newWeight; //only makes sense to update weight, other values shouldn't change

		
			Animal.findOne( {name: updateName}, function(err, myAnimal) { //find the Animal to be updated in the database
				if (err) {
					res.render('resultpage', {result : err});   
				}
				else{
                    myAnimal.weight = updateWeight;
					myAnimal.save(function(err){
						if(err){
							res.render('resultpage', {result : err});  
						}
						else {
						const msg = `Animal data updated for: ${updateName}`; // display the update message
						res.render('resultPage', { result : msg });
						}
					
					});		
				}
			});
		}
	}	
});

app.get('/deleteAnimal', function(req, res){
	
	let name = req.query.name; //find the animal to be removed based on name
		Animal.findOneAndRemove( {name: name}, function(err, myAnimal) {  
		if (err) {
			res.render('resultpage', {result : err});   
			}
		else {
			const msg = `Animal ${name} removed`; //populate the result message
			res.render('resultPage', { result : msg });
			}
		});
	
});
	
const port = 3000
app.listen(port,  function() {
	console.log(`Listening on port ${port}, ctrl-c to quit`);
    });


