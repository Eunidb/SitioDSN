import Formulario from "../models/form.model.js";

// Función auxiliar para calificar cada área del desarrollo
const getAreaColor = (areaResponses) => {
  const siCount = areaResponses.filter(r => r === 'SI').length;
  if (siCount >= 2) return "verde";
  if (siCount === 1) return "amarillo";
  return "rojo";
};

// Función principal de clasificación del color final
function clasificarColor(respuestasData) {
  // Evaluación de Factores de Riesgo Biológico (FRB)
  const frbRisky = [
    respuestasData.frb_asistenciaConsultas,
    respuestasData.frb_complicacionesEmbarazo,
    respuestasData.frb_gestacionMenor34Semanas,
    respuestasData.frb_pesoNacimiento1500g,
    respuestasData.frb_retardoRespiracionCircularCordon,
    respuestasData.frb_hospitalizacionUCIN,
    respuestasData.frb_madreMenor16
  ].includes('SI');

  // Evaluación de Exploración Neurológica (EN)
  const enRisky = [
    respuestasData.en_alteracionMovilidadCuerpo,
    respuestasData.en_alteracionAsimetriaOjosFacial,
    respuestasData.en_perimetroCefalicoDE
  ].includes('SI');

  if (enRisky) return "rojo";

  // Evaluación de Señales de Alarma (SA)
  const saRisky = [
    respuestasData.sa_escribirNumerosLetras === 'NO',
    respuestasData.sa_completarOracionesOpuesto === 'NO',
    respuestasData.sa_identificaValorMonedas === 'NO',
    respuestasData.sa_doloresCabezaVisionBorrosaMareo === 'SI',
    respuestasData.sa_dificultadHigieneVestirse === 'SI',
    respuestasData.sa_miedoAgresionTristeza === 'SI',
    respuestasData.sa_necesitaAcercarseObjetos === 'SI',
    respuestasData.sa_caeFrecuentementeCorrer === 'SI',
    respuestasData.sa_orinaCamaNoches === 'SI',
    respuestasData.sa_distraeFacilmente === 'SI'
  ].some(v => v);

  if (saRisky) return "rojo";

  // Áreas del Desarrollo
  const desarrolloAreaColors = [
    getAreaColor([
      respuestasData.dev_mg_brincarUnPie,
      respuestasData.dev_mg_brincarHaciaAtras,
      respuestasData.dev_mg_caminarLineaRecta
    ]),
    getAreaColor([
      respuestasData.dev_mf_dibujarTriangulo,
      respuestasData.dev_mf_tocarPuntaPulgar,
      respuestasData.dev_mf_cortarPapelTijeras
    ]),
    getAreaColor([
      respuestasData.dev_len_hablarClaridad,
      respuestasData.dev_len_comunicarEmociones,
      respuestasData.dev_len_seguirOrdenesTresPasos
    ]),
    getAreaColor([
      respuestasData.dev_soc_compartirCosas,
      respuestasData.dev_soc_gustoIrEscuela,
      respuestasData.dev_soc_esperaTurno
    ])
  ];

  if (desarrolloAreaColors.includes("rojo")) return "rojo";
  if (desarrolloAreaColors.includes("amarillo")) return "amarillo";
  return "verde";
}

// Crear nuevo formulario
export const crearFormulario = async (req, res) => {
  try {
    const {
      nombre, edad, grado, grupo,
      frb_asistenciaConsultas, frb_complicacionesEmbarazo, frb_gestacionMenor34Semanas,
      frb_pesoNacimiento1500g, frb_retardoRespiracionCircularCordon, frb_hospitalizacionUCIN, frb_madreMenor16,
      en_alteracionMovilidadCuerpo, en_alteracionAsimetriaOjosFacial, en_perimetroCefalicoDE,
      dev_mg_brincarUnPie, dev_mg_brincarHaciaAtras, dev_mg_caminarLineaRecta,
      dev_mf_dibujarTriangulo, dev_mf_tocarPuntaPulgar, dev_mf_cortarPapelTijeras,
      dev_len_hablarClaridad, dev_len_comunicarEmociones, dev_len_seguirOrdenesTresPasos,
      dev_soc_compartirCosas, dev_soc_gustoIrEscuela, dev_soc_esperaTurno,
      sa_escribirNumerosLetras, sa_completarOracionesOpuesto, sa_identificaValorMonedas,
      sa_doloresCabezaVisionBorrosaMareo, sa_dificultadHigieneVestirse, sa_miedoAgresionTristeza,
      sa_necesitaAcercarseObjetos, sa_caeFrecuentementeCorrer, sa_orinaCamaNoches, sa_distraeFacilmente
    } = req.body;

    if (!nombre || !edad || !grado || !grupo) {
      return res.status(400).json({ message: "Faltan campos obligatorios: nombre, edad, grado, grupo." });
    }

    const respuestasData = {
      frb_asistenciaConsultas, frb_complicacionesEmbarazo, frb_gestacionMenor34Semanas,
      frb_pesoNacimiento1500g, frb_retardoRespiracionCircularCordon, frb_hospitalizacionUCIN, frb_madreMenor16,
      en_alteracionMovilidadCuerpo, en_alteracionAsimetriaOjosFacial, en_perimetroCefalicoDE,
      dev_mg_brincarUnPie, dev_mg_brincarHaciaAtras, dev_mg_caminarLineaRecta,
      dev_mf_dibujarTriangulo, dev_mf_tocarPuntaPulgar, dev_mf_cortarPapelTijeras,
      dev_len_hablarClaridad, dev_len_comunicarEmociones, dev_len_seguirOrdenesTresPasos,
      dev_soc_compartirCosas, dev_soc_gustoIrEscuela, dev_soc_esperaTurno,
      sa_escribirNumerosLetras, sa_completarOracionesOpuesto, sa_identificaValorMonedas,
      sa_doloresCabezaVisionBorrosaMareo, sa_dificultadHigieneVestirse, sa_miedoAgresionTristeza,
      sa_necesitaAcercarseObjetos, sa_caeFrecuentementeCorrer, sa_orinaCamaNoches, sa_distraeFacilmente
    };

    const color = clasificarColor(respuestasData);

    const nuevoFormulario = new Formulario({
      nombre,
      edad,
      grado,
      grupo,
      color,
      usuario: req.user.id,
      ...respuestasData
    });

    const saved = await nuevoFormulario.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error al crear formulario:", error);
    res.status(500).json({ message: "Error al crear formulario", error: error.message });
  }
};

// Obtener formularios
export const getFormularios = async (req, res) => {
  try {
    let query = {};
    if (req.user.rol?.startsWith('maestro')) {
      const grado = req.user.rol.replace('maestro', '');
      if (['1', '2', '3'].includes(grado)) {
        query.grado = grado;
      }
    }

    const formularios = await Formulario.find(query).sort({ fecha: -1 });
    res.json(formularios);
  } catch (error) {
    console.error("❌ Error al obtener formularios:", error);
    res.status(500).json({ message: "Error al obtener formularios" });
  }
};

// Editar formulario
export const editarFormulario = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.respuestas) {
      req.body.color = clasificarColor(req.body.respuestas);
    }

    const updated = await Formulario.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Error al editar formulario:", error);
    res.status(500).json({ message: "Error al editar formulario" });
  }
};

// Eliminar formulario
export const eliminarFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Formulario.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }

    res.json({ message: "Formulario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar formulario:", error);
    res.status(500).json({ message: "Error al eliminar formulario" });
  }
};
