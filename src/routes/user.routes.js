import { Router } from "express";
import { auth, adminRequired } from "../middlewares/auth.middelware.js"; // Importa tu 'auth' y el nuevo 'adminRequired'
import { validateSchema } from "../middlewares/validateSchema.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

// Todas las rutas de gestión de usuarios requieren autenticación y rol de administrador
router.use(auth); // Primero, asegura que el usuario esté autenticado
router.use(adminRequired); // Luego, asegura que el usuario autenticado sea un administrador

router.get("/users", getUsers); // Obtener todos los usuarios
router.get("/users/:id", getUser); // Obtener un solo usuario por ID
router.post("/users", validateSchema(createUserSchema), createUser); // Crear un nuevo usuario
router.put("/users/:id", validateSchema(updateUserSchema), updateUser); // Actualizar un usuario existente
router.delete("/users/:id", deleteUser); // Eliminar un usuario

export default router;