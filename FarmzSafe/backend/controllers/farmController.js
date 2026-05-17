const Farm = require('../models/Farm');


const AddFarm = async (req, res) => {
  try {
    const { farmName, owner, location, contact, animals } = req.body;

    if (!farmName || !owner || !location ||!contact|| !animals ) {
      return res.status(400).json({ message: "Bad request, Please fill in all required fields" });
    }

    const farm = await Farm.create({ farmName,owner, location, animals, contact,  });

    res.status(201).json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFarm = await Farm.findByIdAndDelete(id);

    if (!deletedFarm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.status(200).json({ message: "Farm deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Oops, server error" });
  }
};


// Get all farms
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.status(200).json(farms);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one farm by ID
const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);

    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Edit one farm
const editFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFarm = await Farm.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFarm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.status(200).json(updatedFarm);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    res.status(404).json({message:"Farm not found"})
  }
};

// Add new animal to a farm without recreating farm
const addAnimalToFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { type, count, vaccinatedAnimalCount, sickAnimalCount } = req.body;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    farm.animals.push({ type, count, vaccinatedAnimalCount, sickAnimalCount });
    await farm.save();

    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update existing animal counts in a farm , also without recreating farm.
const updateAnimalInFarm = async (req, res) => {
  try {
    const { farmId, animalId } = req.params;
    const { count, vaccinatedAnimalCount, sickAnimalCount } = req.body;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const animal = farm.animals.id(animalId);
    if (!animal) {
      return res.status(404).json({ message: "Animal not found in this farm" });
    }

    if (count !== undefined) animal.count = count;
    if (vaccinatedAnimalCount !== undefined) animal.vaccinatedAnimalCount = vaccinatedAnimalCount;
    if (sickAnimalCount !== undefined) animal.sickAnimalCount = sickAnimalCount;

    await farm.save();

    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {AddFarm, deleteFarm, getFarms, getFarmById, editFarm, addAnimalToFarm, updateAnimalInFarm};