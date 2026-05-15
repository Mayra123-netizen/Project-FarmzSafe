const mongoose = require("mongoose")

const AnimalSchema = new mongoose.schema({
      type: { type: String, required: true }, 
      count: { type: Number, default: 0 },
      vaccinatedAnimalCount: { type: Number, default: 0 },
      sickAnimalCount: { type: Number, default: 0 }
}

)
module.exports = mongoose.model('Animal', AnimalSchema);
