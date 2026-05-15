const mongoose = require("mongoose")

const ReportSchema = new mongoose.schema({
      title: { type: String, required: true }, 
      desciption : { type: String,}
    

}

)
module.exports = mongoose.model('Report', ReportSchema);
