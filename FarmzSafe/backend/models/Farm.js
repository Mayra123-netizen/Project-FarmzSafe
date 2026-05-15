const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  location:{ type: String, required: true},
   contact: {type: String, required: true},
  animals: [
    {
      type: { type: String, required: true }, 
      count: { type: Number, default: 0 },
      vaccinatedAnimalCount: { type: Number, default: 0 },
      sickAnimalCount: { type: Number, default: 0 }
    }
  ],
  });
     {timestamps : true}
    


module.exports = mongoose.model('Farm', farmSchema);
