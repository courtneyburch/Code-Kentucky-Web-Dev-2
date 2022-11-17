const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://codekentucky:QmjhAoqCs5CdD5jM@cluster0.46pmhda.mongodb.net/?retryWrites=true&w=majority');  

const animalSchema = new mongoose.Schema({
	type: {type: String, required: true},
    name: { type: String, required: true },
	breed: {type: String, required: false},
	DOB: { type: Date, required: true },
	coloring: { type: String, required: false },
    weight: {type: Number, min: 0, required: false }

});

animalSchema.virtual('age').get(function(){
    const birthdate = this.DOB;
    const age = Math.floor((Date.now() - birthdate.getTime()) / (1000 * 3600 * 24 * 365));
    //console.log(age);
    return age;

});

module.exports = mongoose.model('Animal', animalSchema);

