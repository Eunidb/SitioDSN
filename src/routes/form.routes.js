import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { requireRole } from "../middlewares/validateRole.js";
import * as formController from "../controllers/form.controller.js";

const router = Router();

router.post("/formularios", authRequired, formController.crearFormulario);
router.get("/formularios", authRequired, formController.getFormularios);
router.put("/formularios/:id", authRequired, formController.editarFormulario);
router.delete("/formularios/:id", authRequired, formController.eliminarFormulario);

export default router;
