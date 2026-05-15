const { User, Farm, SafetyReport } = require('../models/models');

// Farm Controllers
exports.createFarm = async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate('owner', 'name email');
    res.status(200).json({ success: true, data: farms });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Safety Report Controllers
exports.createReport = async (req, res) => {
  try {
    const report = await SafetyReport.create(req.body);
    // Update farm safety score if it's an incident
    if (req.body.type === 'incident') {
      await Farm.findByIdAndUpdate(req.body.farm, { $inc: { safetyScore: -5 } });
    }
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await SafetyReport.find()
      .populate('farm', 'name')
      .populate('reporter', 'name');
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// User Controllers (Basic)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
