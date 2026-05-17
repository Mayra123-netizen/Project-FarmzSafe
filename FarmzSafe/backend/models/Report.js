const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
   fileUrl: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
