const Vaccine  = require("../models/Vaccine.js")




// Get all vaccines
const getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find();
    res.status(200).json(vaccines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addVaccine = async (req, res) => {
      try {
        const { vaccineName, diseaseName, IsAvailable, stock, expiryDate } = req.body;
        const vaccine = await Vaccine.create({ 
          vaccineName, 
          diseaseName, 
          IsAvailable: IsAvailable !== undefined ? IsAvailable : true,
          stock: stock || 0,
          expiryDate: expiryDate || new Date()
        });
        res.status(201).json(vaccine);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// Edit vvccine
const editVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVaccine = await Vaccine.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedVaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.status(200).json(updatedVaccine);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a vaccine
const deleteVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVaccine = await Vaccine.findByIdAndDelete(id);

    if (!deletedVaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.status(200).json({ message: "Vaccine deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getVaccines, editVaccine, deleteVaccine,addVaccine };
