import Address from "../models/Address.js";

//api add address api/address/add
export const addAdress = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { address } = req.body;
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Adress Added Sussessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//api add address api/address/get
export const getAdress = async (req, res) => {
  try {
    // const { userId } = req.body;
     const userId = req.user.id;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
