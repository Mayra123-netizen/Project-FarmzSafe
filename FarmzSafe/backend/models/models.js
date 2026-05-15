const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'worker'], default: 'worker' },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  createdAt: { type: Date, default: Date.now }
});

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  size: { type: Number }, // in acres
  safetyScore: { type: Number, default: 100 },
  lastAudit: { type: Date }
});

const SafetyReportSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['audit', 'incident', 'maintenance'], required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Farm = mongoose.model('Farm', FarmSchema);
const SafetyReport = mongoose.model('SafetyReport', SafetyReportSchema);

module.exports = { User, Farm, SafetyReport };
