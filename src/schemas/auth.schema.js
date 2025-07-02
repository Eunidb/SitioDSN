import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorización denegada" }); // Mensaje en español

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "El token no es válido" }); // Mensaje en español
      }
      req.user = user; // Adjunta el payload del usuario a la solicitud
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Nuevo middleware para requerir el rol de administrador
export const adminRequired = (req, res, next) => {
  // Este middleware asume que 'auth' (o un middleware similar de verificación de token)
  // ya se ejecutó y adjuntó correctamente el payload del usuario a req.user.
  // El objeto de usuario (req.user) debe contener la propiedad 'rol'.

  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};