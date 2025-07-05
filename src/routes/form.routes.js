import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { requireRole } from "../middlewares/validateRole.js";
import * as formController from "../controllers/form.controller.js";

const router = Router();

// Crear formulario (acceso con autenticación)
router.post("/formularios", authRequired, formController.crearFormulario);

// Obtener formularios (filtrados según el rol)
router.get("/formularios", authRequired, formController.getFormularios);

// Editar formulario por ID
router.put("/formularios/:id", authRequired, formController.editarFormulario);

// Eliminar formulario por ID
router.delete("/formularios/:id", authRequired, formController.eliminarFormulario);

export default router;
