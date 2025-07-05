export const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.rol) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ message: "Acceso denegado: rol incorrecto" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error en validación de rol" });
    }
  };
};
