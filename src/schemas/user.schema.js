import { z } from "zod";

// Esquema para crear un nuevo usuario (la contraseña es requerida)
export const createUserSchema = z.object({
  username: z.string({
    required_error: "El nombre de usuario es requerido",
  }).min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres",
  }),
  email: z.string({
    required_error: "El email es requerido",
  }).email({
    message: "Email inválido",
  }),
  password: z.string({
    required_error: "La contraseña es requerida",
  }).min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  rol: z.enum(['admin', 'maestro1', 'maestro2', 'maestro3'], {
    required_error: "El rol es requerido",
    invalid_type_error: "Rol inválido. Debe ser 'admin', 'maestro1', 'maestro2' o 'maestro3'",
  }).default('maestro1'),
});

// Esquema para actualizar un usuario existente (la contraseña es opcional)
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .optional(), // El nombre de usuario es opcional para la actualización
  email: z.string()
    .email({
      message: "Email inválido",
    })
    .optional(), // El email es opcional para la actualización
  password: z.string()
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .optional(), // La contraseña es opcional para la actualización
  rol: z.enum(['admin', 'maestro1', 'maestro2', 'maestro3'], {
    invalid_type_error: "Rol inválido. Debe ser 'admin', 'maestro1', 'maestro2' o 'maestro3'",
  }).optional(), // El rol es opcional para la actualización
}).partial(); // Hace que todos los campos sean opcionales por defecto, luego agregamos reglas específicas