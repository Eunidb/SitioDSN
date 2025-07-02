
export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Zod errors come in an array
    if (error.errors && Array.isArray(error.errors)) {
      return res
        .status(400)
        .json(error.errors.map((err) => err.message));
    }
    // Handle other unexpected errors
    return res.status(500).json({ message: "Error de validación desconocido" });
  }
};