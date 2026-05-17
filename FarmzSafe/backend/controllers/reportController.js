const Report = require("../models/Report");


const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a new report
const addReport = async (req, res) => {
  try {
    const { title, description, fileUrl} = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const report = await Report.create({ title, description,fileUrl });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Edit the report
const editReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete one reports
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
//Get nly one report

const getReport = async (req, res) => {
  try {
    const { id } = req.params; 
    const report = await Report.findById();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { getReports, addReport, editReport, deleteReport };
