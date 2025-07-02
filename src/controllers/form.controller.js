import Formulario from "../models/form.model.js";

// Función auxiliar para calificar cada área del desarrollo
const getAreaColor = (areaResponses) => {
  const siCount = areaResponses.filter(r => r === 'SI').length;
  // Reglas del documento:
  // "3 o 2 respuestas obtenidas en Verde, la calificación será VERDE."
  if (siCount >= 2) return "verde";
  // "1 o ninguna obtenida en Verde, la calificación será AMARILLO." 
  if (siCount === 1) return "amarillo";
  return "rojo"; // 0 SI
};

// Función principal de clasificación del color final
function clasificarColor(respuestasData, gradoActual) {
  let finalColor = "verde"; // Valor inicial optimista

  // 1. Evaluación de Factores de Riesgo Biológico (FRB) 
  const frbRisky = [
    respuestasData.frb_asistenciaConsultas,
    respuestasData.frb_complicacionesEmbarazo,
    respuestasData.frb_gestacionMenor34Semanas,
    respuestasData.frb_pesoNacimiento1500g,
    respuestasData.frb_retardoRespiracionCircularCordon,
    respuestasData.frb_hospitalizacionUCIN,
    respuestasData.frb_madreMenor16
  ].includes('SI');

  if (frbRisky) {
    // Lógica específica para FRB si es necesaria
  }

  // 2. Evaluación de Exploración Neurológica (EN) 
  const enRisky = [
    respuestasData.en_alteracionMovilidadCuerpo,
    respuestasData.en_alteracionAsimetriaOjosFacial,
    respuestasData.en_perimetroCefalicoDE
  ].includes('SI');

  if (enRisky) {
    return "rojo"; // Redirige directamente a ROJO si hay riesgo neurológico.
  }

  // 3. Evaluación de Señales de Alarma (SA) 
  const saRisky = [
    // Preguntas donde 'NO' es la señal de alarma (habilidades no logradas)
    respuestasData.sa_escribirNumerosLetras === 'NO',
    respuestasData.sa_completarOracionesOpuesto === 'NO',
    respuestasData.sa_identificaValorMonedas === 'NO',
    // Preguntas donde 'SI' es la señal de alarma (síntomas presentes)
    respuestasData.sa_doloresCabezaVisionBorrosaMareo === 'SI',
    respuestasData.sa_dificultadHigieneVestirse === 'SI',
    respuestasData.sa_miedoAgresionTristeza === 'SI',
    // Nuevas señales de alarma
    respuestasData.sa_necesitaAcercarseObjetos === 'SI',
    respuestasData.sa_caeFrecuentementeCorrer === 'SI',
    respuestasData.sa_orinaCamaNoches === 'SI',
    respuestasData.sa_distraeFacilmente === 'SI'
  ].some(isRisky => isRisky);

  if (saRisky) {
    return "rojo"; // Redirige directamente a ROJO si hay señales de alarma.
  }

  // 4. Evaluación de Áreas del Desarrollo (60-71 meses) 
  const areaMotrizGruesaResponses = [
    respuestasData.dev_mg_brincarUnPie,
    respuestasData.dev_mg_brincarHaciaAtras,
    respuestasData.dev_mg_caminarLineaRecta
  ];
  const colorMotrizGruesa = getAreaColor(areaMotrizGruesaResponses);

  const areaMotrizFinaResponses = [
    respuestasData.dev_mf_dibujarTriangulo,
    respuestasData.dev_mf_tocarPuntaPulgar,
    respuestasData.dev_mf_cortarPapelTijeras
  ];
  const colorMotrizFina = getAreaColor(areaMotrizFinaResponses);

  const areaLenguajeResponses = [
    respuestasData.dev_len_hablarClaridad,
    respuestasData.dev_len_comunicarEmociones,
    respuestasData.dev_len_seguirOrdenesTresPasos
  ];
  const colorLenguaje = getAreaColor(areaLenguajeResponses);

  const areaSocialResponses = [
    respuestasData.dev_soc_compartirCosas,
    respuestasData.dev_soc_gustoIrEscuela,
    respuestasData.dev_soc_esperaTurno
  ];
  const colorSocial = getAreaColor(areaSocialResponses);

  const desarrolloAreaColors = [colorMotrizGruesa, colorMotrizFina, colorLenguaje, colorSocial];

  // Reglas de calificación del desarrollo:
  if (desarrolloAreaColors.includes("rojo")) {
    return "rojo";
  }
  if (desarrolloAreaColors.includes("amarillo")) {
    return "amarillo";
  }

  return "verde";
}

// Crear nuevo formulario
export const crearFormulario = async (req, res) => {
  try {
    // Desestructurar todos los campos esperados del body
    const {
      nombre, edad, grado, grupo,
      // FRB 
      frb_asistenciaConsultas, frb_complicacionesEmbarazo, frb_gestacionMenor34Semanas,
      frb_pesoNacimiento1500g, frb_retardoRespiracionCircularCordon, frb_hospitalizacionUCIN, frb_madreMenor16,
      // EN 
      en_alteracionMovilidadCuerpo, en_alteracionAsimetriaOjosFacial, en_perimetroCefalicoDE,
      // Desarrollo (60-71 meses) 
      dev_mg_brincarUnPie, dev_mg_brincarHaciaAtras, dev_mg_caminarLineaRecta,
      dev_mf_dibujarTriangulo, dev_mf_tocarPuntaPulgar, dev_mf_cortarPapelTijeras,
      dev_len_hablarClaridad, dev_len_comunicarEmociones, dev_len_seguirOrdenesTresPasos,
      dev_soc_compartirCosas, dev_soc_gustoIrEscuela, dev_soc_esperaTurno,
      // Señales de Alarma 
      sa_escribirNumerosLetras, sa_completarOracionesOpuesto, sa_identificaValorMonedas,
      sa_doloresCabezaVisionBorrosaMareo, sa_dificultadHigieneVestirse, sa_miedoAgresionTristeza,
      sa_necesitaAcercarseObjetos, sa_caeFrecuentementeCorrer, sa_orinaCamaNoches, sa_distraeFacilmente
    } = req.body;

    // Crear un objeto con todas las respuestas para pasarlo a clasificarColor
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

    // Validaciones básicas
    if (!nombre || !edad || !grado || !grupo) {
      return res.status(400).json({ message: "Faltan campos obligatorios (nombre, edad, grado, grupo)" });
    }

    const color = clasificarColor(respuestasData, grado);

    const nuevoFormulario = new Formulario({
      nombre,
      edad,
      grado,
      grupo,
      color,
      usuario: req.user.id,
      // Asignar todas las respuestas individuales al modelo
      ...respuestasData
    });

    const saved = await nuevoFormulario.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error al crear formulario:", error);
    res.status(500).json({ message: "Error al crear formulario", error: error.message });
  }
};

// Obtener formularios (admin ve todos, maestros solo su grado)
export const getFormularios = async (req, res) => {
  try {
    console.log("👉 Usuario logueado:", req.user);

    let query = {};
    if (req.user.rol && req.user.rol.startsWith('maestro')) {
      // Extrae el grado del rol, asumiendo 'maestro1', 'maestro2', 'maestro3'
      const grado = req.user.rol.replace('maestro', '');
      if (['1', '2', '3'].includes(grado)) {
        query.grado = grado;
      } else {
        console.warn(`Rol de maestro inválido para filtrar por grado: ${req.user.rol}`);
      }
    }

    console.log("🛠 Consulta:", query);

    const formularios = await Formulario.find(query).sort({ fecha: -1 });
    res.json(formularios);
  } catch (error) {
    console.error("❌ Error real al obtener formularios:", error);
    res.status(500).json({ message: "Error al obtener formularios" });
  }
};

// Editar formulario
export const editarFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    // La lógica de reclasificación de color aquí si los campos de respuestas son modificables
    if (req.body.respuestas) {
      const color = clasificarColor(req.body.respuestas);
      req.body.color = color;
    }
    const updated = await Formulario.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Formulario no encontrado" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al editar formulario" });
  }
};

// Eliminar formulario
export const eliminarFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Formulario.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Formulario no encontrado" });

    res.json({ message: "Formulario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar formulario" });
  }
};