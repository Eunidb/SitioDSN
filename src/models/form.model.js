import mongoose from "mongoose";

const formularioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  grado: { type: String, required: true }, // o Number si usas 1, 2, 3
  grupo: { type: String, required: true },
  color: { type: String, enum: ["verde", "amarillo", "rojo"], required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fecha: { type: Date, default: Date.now },

  // FRB
  frb_asistenciaConsultas: String,
  frb_complicacionesEmbarazo: String,
  frb_gestacionMenor34Semanas: String,
  frb_pesoNacimiento1500g: String,
  frb_retardoRespiracionCircularCordon: String,
  frb_hospitalizacionUCIN: String,
  frb_madreMenor16: String,

  // EN
  en_alteracionMovilidadCuerpo: String,
  en_alteracionAsimetriaOjosFacial: String,
  en_perimetroCefalicoDE: String,

  // Desarrollo
  dev_mg_brincarUnPie: String,
  dev_mg_brincarHaciaAtras: String,
  dev_mg_caminarLineaRecta: String,

  dev_mf_dibujarTriangulo: String,
  dev_mf_tocarPuntaPulgar: String,
  dev_mf_cortarPapelTijeras: String,

  dev_len_hablarClaridad: String,
  dev_len_comunicarEmociones: String,
  dev_len_seguirOrdenesTresPasos: String,

  dev_soc_compartirCosas: String,
  dev_soc_gustoIrEscuela: String,
  dev_soc_esperaTurno: String,

  // SA
  sa_escribirNumerosLetras: String,
  sa_completarOracionesOpuesto: String,
  sa_identificaValorMonedas: String,
  sa_doloresCabezaVisionBorrosaMareo: String,
  sa_dificultadHigieneVestirse: String,
  sa_miedoAgresionTristeza: String,
  sa_necesitaAcercarseObjetos: String,
  sa_caeFrecuentementeCorrer: String,
  sa_orinaCamaNoches: String,
  sa_distraeFacilmente: String,
});

export default mongoose.model("Formulario", formularioSchema);
