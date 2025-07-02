import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
//import jwt from 'jsonwebtoken'
import { createAccessToken } from '../libs/jwt.js'

export const register = async (req, res) => {
    const {email, password, username, rol} = req.body
       //console.log(email, password, username)
      try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
        username,
        email,
        password: passwordHash,
        rol
       }) 
      // console.log(newUser)
      const userSaved = await newUser.save(); 
    const token =  await createAccessToken({ id: userSaved._id})
    res.cookie("token", token);  
    res.json({
        id: userSaved._id,
        email: userSaved.email,
        username: userSaved.username,
        rol: userSaved.rol
      })
      } catch (error) {
        console.log(error);
      }
}

export const login = async (req, res) => {
    const {email, password} = req.body
       //console.log(email, password, username)
      try {

        const userFound = await User.findOne({email});

        if (!userFound) return res.status(400).json({message : "usuario no encontrado"})
        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(400).json({message: "Contraseña incorrecta"})
      
    const token =  await createAccessToken({ id: userFound._id})
    res.cookie("token", token);  
    res.json({
        id: userFound._id,
        email: userFound.email,
        username: userFound.username,
        rol: userFound.rol
      })
      } catch (error) {
        console.log(error);
      }
}

export const logout = async (req, res) => {
  res.cookie('token', "",{
    expires: new Date(0)
  })
  return res.sendStatus(200);
}

export const profile = async (req, res)  => {
  const userFound = await User.findById(req.user.id)
  if (!userFound) return res.status(400).json({message : "usuario no encontrado"})
  res.json({
        id: userFound._id,
        email: userFound.email,
        username: userFound.username,
        rol: userFound.rol
      })
}