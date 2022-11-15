const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/animals');  

const animalSchema = new mongoose.Schema({
	type: {type: String, required: true},
    name: { type: String, required: true },
	breed: {type: String, required: false},
	age: { type: String, required: true },
	coloring: { type: String, required: false }
});

// tripSchema.virtual('mpg').get(function() {  
// 	if(this.miles == 0 || this.gallons == 0)
// 		mpg = 0;
    
// 	else {
// 		mpg = this.miles / this.gallons;
// 	}
//     return parseFloat(mpg).toFixed(2);
// });

module.exports = mongoose.model('Animal', animalSchema);