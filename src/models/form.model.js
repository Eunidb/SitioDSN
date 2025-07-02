import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  grado: { type: String, enum: ['1', '2', '3'], required: true },
  grupo: { type: String, required: true },
  color: { type: String, enum: ['verde', 'amarillo', 'rojo'], required: true },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Factores de Riesgo Biológico (FRB) - 7 preguntas
  frb_asistenciaConsultas: { type: String, enum: ['SI', 'NO'], required: false },
  frb_complicacionesEmbarazo: { type: String, enum: ['SI', 'NO'], required: false },
  frb_gestacionMenor34Semanas: { type: String, enum: ['SI', 'NO'], required: false },
  frb_pesoNacimiento1500g: { type: String, enum: ['SI', 'NO'], required: false },
  frb_retardoRespiracionCircularCordon: { type: String, enum: ['SI', 'NO'], required: false },
  frb_hospitalizacionUCIN: { type: String, enum: ['SI', 'NO'], required: false },
  frb_madreMenor16: { type: String, enum: ['SI', 'NO'], required: false },

  // Para Exploración Neurológica (EN) - 3 preguntas
  en_alteracionMovilidadCuerpo: { type: String, enum: ['SI', 'NO'], required: false },
  en_alteracionAsimetriaOjosFacial: { type: String, enum: ['SI', 'NO'], required: false },
  en_perimetroCefalicoDE: { type: String, enum: ['SI', 'NO'], required: false },

  // Para Desarrollo (General para todos los rangos de edad)
  // Nota: Los campos a continuación son genéricos y capturarán la respuesta SI/NO
  // para las 3 preguntas más relevantes de cada área para el rango de edad evaluado.

  // Motriz Gruesa
  dev_mg_habilidad1: { type: String, enum: ['SI', 'NO'], required: false },
  dev_mg_habilidad2: { type: String, enum: ['SI', 'NO'], required: false },
  dev_mg_habilidad3: { type: String, enum: ['SI', 'NO'], required: false },
  
  // Motriz Fina
  dev_mf_habilidad1: { type: String, enum: ['SI', 'NO'], required: false },
  dev_mf_habilidad2: { type: String, enum: ['SI', 'NO'], required: false },
  dev_mf_habilidad3: { type: String, enum: ['SI', 'NO'], required: false },
  
  // Lenguaje
  dev_len_habilidad1: { type: String, enum: ['SI', 'NO'], required: false },
  dev_len_habilidad2: { type: String, enum: ['SI', 'NO'], required: false },
  dev_len_habilidad3: { type: String, enum: ['SI', 'NO'], required: false },
  
  // Social
  dev_soc_habilidad1: { type: String, enum: ['SI', 'NO'], required: false },
  dev_soc_habilidad2: { type: String, enum: ['SI', 'NO'], required: false },
  dev_soc_habilidad3: { type: String, enum: ['SI', 'NO'], required: false },

  // Para Área de Conocimiento (Movida de Señales de Alarma para claridad semántica)
  dev_con_escribirNumerosLetras: { type: String, enum: ['SI', 'NO'], required: false },
  dev_con_completarOracionesOpuesto: { type: String, enum: ['SI', 'NO'], required: false },
  dev_con_identificaValorMonedas: { type: String, enum: ['SI', 'NO'], required: false },

  // Para Señales de Alarma / Alerta (ALE)
  sa_doloresCabezaVisionBorrosaMareo: { type: String, enum: ['SI', 'NO'], required: false },
  sa_dificultadHigieneVestirse: { type: String, enum: ['SI', 'NO'], required: false },
  sa_miedoAgresionTristeza: { type: String, enum: ['SI', 'NO'], required: false }, // Puede cubrir timidez, llanto por separación, etc.
  sa_necesitaAcercarseObjetos: { type: String, enum: ['SI', 'NO'], required: false },
  sa_caeFrecuentementeCorrer: { type: String, enum: ['SI', 'NO'], required: false },
  sa_orinaCamaNoches: { type: String, enum: ['SI', 'NO'], required: false },
  sa_distraeFacilmente: { type: String, enum: ['SI', 'NO'], required: false }, // Puede cubrir la pérdida de atención.

  // Nuevos campos sugeridos para Señales de Alerta específicas de grupos de edad
  sa_ignoraOtrosNinos: { type: String, enum: ['SI', 'NO'], required: false }, // Para 49-59 meses
  sa_perdidaHabilidades: { type: String, enum: ['SI', 'NO'], required: false }, // Para 49-59 meses
  sa_erroresPluralesPasado: { type: String, enum: ['SI', 'NO'], required: false }, // Para 37-48 meses
  sa_noDiceNombreApellido: { type: String, enum: ['SI', 'NO'], required: false }, // Para 37-48 meses
  sa_noExpresaEmociones: { type: String, enum: ['SI', 'NO'], required: false }, // Para 37-48 meses
  sa_dificultadPinza: { type: String, enum: ['SI', 'NO'], required: false }, // Para 31-36 meses
  sa_apegoExcesivoPadres: { type: String, enum: ['SI', 'NO'], required: false }, // Para 31-36 meses
  sa_juegoSolitario: { type: String, enum: ['SI', 'NO'], required: false }, // Para 31-36 meses

}, {
  timestamps: true,
});

export default mongoose.model("Formulario", formSchema);