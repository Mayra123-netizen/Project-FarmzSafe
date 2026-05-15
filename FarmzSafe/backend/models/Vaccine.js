const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
    vaccineName: {type : String, required : true},
    diseaseName:{type: String, required : true},
    IsAvailable:{type: Boolean, required:true},
    stock:{type: Number},
    expiryDate: {type: Date, required : true}
    

})

module.exports = mongoose.Model("Vaccine", VaccineSchema)