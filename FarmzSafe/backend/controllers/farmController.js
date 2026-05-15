const farm = require('../models/Farm');


const AddFarm = async (req, res) => {
    try{
        const {farmName, owner,location, animals, createdAt,contact} = req.body;
        if (!farmName || !owner  || !location || !createdAt || !contact ){
         return  res.status(400).json({message : "Bad request, fill in all required fields"})
        }
        const farm = await Farm.create(farmName, owner,location, animals, createdAt,contact);
        
        res.status(201).json(farm);
    }
    catch(error){
        res.status(400).json({message:"Check your Credentials"});
        res.status(500).json({message:"Server Error"});
    }
}
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
const updateFarm = async (req, res) => {
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
module.exports = {AddFarm, deleteFarm, getFarms, getFarmById, updateFarm};