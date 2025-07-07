import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createUser = async (req, res) => {
  const { username, email, password, rol } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El email ya está en uso"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      rol,
    });

    const userSaved = await newUser.save();

    const { password: _, ...userWithoutPassword } = userSaved._doc;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  let updatedData = { ...req.body };

  try {
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const userUpdated = await User.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true, 
    }).select('-password'); 

    if (!userUpdated) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(userUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    if (!userDeleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.sendStatus(204); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};