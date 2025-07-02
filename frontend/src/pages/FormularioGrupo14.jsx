import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import '../index.css';

function FormularioGrupo14() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    grado: "1",
    grupo: "",
    // Factores de Riesgo Biológico (FRB)
    frb_asistenciaConsultas: "",
    frb_complicacionesEmbarazo: "",
    frb_gestacionMenor34Semanas: "",
    frb_pesoNacimiento1500g: "",
    frb_retardoRespiracionCircularCordon: "",
    frb_hospitalizacionUCIN: "",
    frb_madreMenor16: "",

    // Exploración Neurológica (EN)
    en_alteracionMovilidadCuerpo: "",
    en_alteracionAsimetriaOjosFacial: "", 
    en_perimetroCefalicoDE: "",         

    // Desarrollo - Motriz Gruesa (DMG) - Mapeo a habilidades genéricas
    dev_mg_habilidad1: "", 
    dev_mg_habilidad2: "", 
    dev_mg_habilidad3: "", 
    
    // Desarrollo - Motriz Fina (DMF) - Mapeo a habilidades genéricas
    dev_mf_habilidad1: "", 
    dev_mf_habilidad2: "", 
    dev_mf_habilidad3: "", 
    
    // Desarrollo - Lenguaje (DL) - Mapeo a habilidades genéricas
    dev_len_habilidad1: "",
    dev_len_habilidad2: "", 
    dev_len_habilidad3: "", 
    
    // Desarrollo - Social (DS) - Mapeo a habilidades genéricas
    dev_soc_habilidad1: "", 
    dev_soc_habilidad2: "", 
    dev_soc_habilidad3: "", 

    // Desarrollo - Conocimiento (DCO) - Usando nombres de campo específicos del modelo
    dev_con_escribirNumerosLetras: "",    
    dev_con_completarOracionesOpuesto: "",
    dev_con_identificaValorMonedas: "",   

    // Señales de Alarma (SA) - Usando nombres de campo específicos del modelo
    sa_doloresCabezaVisionBorrosaMareo: "",
    sa_dificultadHigieneVestirse: "",     
    sa_miedoAgresionTristeza: "",         

    // Señales de Alerta (SALE) - Usando nombres de campo específicos del modelo
    sa_erroresPluralesPasado: "",   
    sa_distraeFacilmente: "", 
    sa_noDiceNombreApellido: "",     
    sa_noExpresaEmociones: "", 
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error al obtener el perfil:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const evaluarColor = (respuestas) => {
    const contarSi = (arr) => arr.filter((r) => r === "SI").length;

    // Factores de Riesgo Biológico (FRB)
    const frb = [
      respuestas.frb_asistenciaConsultas,
      respuestas.frb_complicacionesEmbarazo,
      respuestas.frb_gestacionMenor34Semanas,
      respuestas.frb_pesoNacimiento1500g,
      respuestas.frb_retardoRespiracionCircularCordon,
      respuestas.frb_hospitalizacionUCIN,
      respuestas.frb_madreMenor16,
    ];

    // Exploración Neurológica (EN)
    const neuro = [
      respuestas.en_alteracionMovilidadCuerpo,
      respuestas.en_alteracionAsimetriaOjosFacial, 
      respuestas.en_perimetroCefalicoDE,        
    ];

    // Desarrollo por áreas - Usando los nombres de habilidad genéricos
    const motriz = [respuestas.dev_mg_habilidad1, respuestas.dev_mg_habilidad2, respuestas.dev_mg_habilidad3];
    const fina = [respuestas.dev_mf_habilidad1, respuestas.dev_mf_habilidad2, respuestas.dev_mf_habilidad3];
    const lenguaje = [respuestas.dev_len_habilidad1, respuestas.dev_len_habilidad2, respuestas.dev_len_habilidad3];
    const social = [respuestas.dev_soc_habilidad1, respuestas.dev_soc_habilidad2, respuestas.dev_soc_habilidad3];
    const conocimiento = [
      respuestas.dev_con_escribirNumerosLetras,
      respuestas.dev_con_completarOracionesOpuesto,
      respuestas.dev_con_identificaValorMonedas,
    ];

    // Señales de Alarma (SA) - Basadas en las preguntas del formulario 49-59 meses
    const senalesAlarma = [
      respuestas.sa_doloresCabezaVisionBorrosaMareo,
      respuestas.sa_dificultadHigieneVestirse,      
      respuestas.sa_miedoAgresionTristeza,  
    ];

    // Señales de Alerta (SALE) - Basadas en las preguntas del formulario 49-59 meses
    const senalesAlerta = [
      respuestas.sa_erroresPluralesPasado,
      respuestas.sa_dificultadHigieneVestirse, 
      respuestas.sa_distraeFacilmente,
      respuestas.sa_miedoAgresionTristeza,
      respuestas.sa_noDiceNombreApellido,
      respuestas.sa_noExpresaEmociones,
    ].filter(Boolean); 


    const areaColor = (respuestasArea) => {
      const si = contarSi(respuestasArea);
      return si >= 2 ? "verde" : si === 1 ? "amarillo" : "rojo";
    };

    const resultadosDesarrollo = [
      areaColor(motriz),
      areaColor(fina),
      areaColor(lenguaje),
      areaColor(social),
      areaColor(conocimiento),
    ];

    // Criterios para ROJO
    const isRojo =
      contarSi(frb) >= 3 ||
      neuro.includes("SI") || 
      senalesAlarma.includes("SI") || 
      senalesAlerta.includes("SI") || 
      resultadosDesarrollo.includes("rojo"); 

    if (isRojo) return "rojo";

    // Criterios para AMARILLO
    const isAmarillo =
      contarSi(frb) > 0 || // Más de 0 FRB
      resultadosDesarrollo.includes("amarillo"); 

    if (isAmarillo) return "amarillo";

    return "verde";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const colorEvaluado = evaluarColor(form);

    try {
      await axios.post(
        "http://localhost:3000/api/formularios",
        {
          nombre: form.nombre,
          edad: parseInt(form.edad),
          grado: form.grado,
          grupo: form.grupo,
          color: colorEvaluado,
          // Factores de Riesgo Biológico
          frb_asistenciaConsultas: form.frb_asistenciaConsultas,
          frb_complicacionesEmbarazo: form.frb_complicacionesEmbarazo,
          frb_gestacionMenor34Semanas: form.frb_gestacionMenor34Semanas,
          frb_pesoNacimiento1500g: form.frb_pesoNacimiento1500g,
          frb_retardoRespiracionCircularCordon: form.frb_retardoRespiracionCircularCordon,
          frb_hospitalizacionUCIN: form.frb_hospitalizacionUCIN,
          frb_madreMenor16: form.frb_madreMenor16,

          // Exploración Neurológica
          en_alteracionMovilidadCuerpo: form.en_alteracionMovilidadCuerpo,
          en_alteracionAsimetriaOjosFacial: form.en_alteracionAsimetriaOjosFacial,
          en_perimetroCefalicoDE: form.en_perimetroCefalicoDE,

          // Desarrollo - Motriz Gruesa
          dev_mg_habilidad1: form.dev_mg_habilidad1,
          dev_mg_habilidad2: form.dev_mg_habilidad2,
          dev_mg_habilidad3: form.dev_mg_habilidad3,
          
          // Desarrollo - Motriz Fina
          dev_mf_habilidad1: form.dev_mf_habilidad1,
          dev_mf_habilidad2: form.dev_mf_habilidad2,
          dev_mf_habilidad3: form.dev_mf_habilidad3,
          
          // Desarrollo - Lenguaje
          dev_len_habilidad1: form.dev_len_habilidad1,
          dev_len_habilidad2: form.dev_len_habilidad2,
          dev_len_habilidad3: form.dev_len_habilidad3,
          
          // Desarrollo - Social
          dev_soc_habilidad1: form.dev_soc_habilidad1,
          dev_soc_habilidad2: form.dev_soc_habilidad2,
          dev_soc_habilidad3: form.dev_soc_habilidad3,

          // Desarrollo - Conocimiento
          dev_con_escribirNumerosLetras: form.dev_con_escribirNumerosLetras,
          dev_con_completarOracionesOpuesto: form.dev_con_completarOracionesOpuesto,
          dev_con_identificaValorMonedas: form.dev_con_identificaValorMonedas,
          
          // Señales de Alarma
          sa_doloresCabezaVisionBorrosaMareo: form.sa_doloresCabezaVisionBorrosaMareo,
          sa_dificultadHigieneVestirse: form.sa_dificultadHigieneVestirse,
          sa_miedoAgresionTristeza: form.sa_miedoAgresionTristeza,
          sa_necesitaAcercarseObjetos: form.sa_necesitaAcercarseObjetos,
          sa_caeFrecuentementeCorrer: form.sa_caeFrecuentementeCorrer,  
          sa_orinaCamaNoches: form.sa_orinaCamaNoches,            
          sa_distraeFacilmente: form.sa_distraeFacilmente,

          // Señales de Alerta específicas 
          sa_ignoraOtrosNinos: form.sa_ignoraOtrosNinos,
          sa_perdidaHabilidades: form.sa_perdidaHabilidades,
          sa_erroresPluralesPasado: form.sa_erroresPluralesPasado,
          sa_noDiceNombreApellido: form.sa_noDiceNombreApellido,
          sa_noExpresaEmociones: form.sa_noExpresaEmociones,
          sa_dificultadPinza: form.sa_dificultadPinza,
          sa_apegoExcesivoPadres: form.sa_apegoExcesivoPadres,
          sa_juegoSolitario: form.sa_juegoSolitario,
        },
        { withCredentials: true }
      );

      if (colorEvaluado === "verde") {
        setMensaje("Formulario enviado correctamente. Desarrollo normal.");
      } else {
        // Mensaje actualizado para 49-59 meses
        setMensaje(`Evaluación en ${colorEvaluado.toUpperCase()}. Se sugiere valoración y seguimiento. Puede que requiera aplicar el grupo anterior si es pertinente.`);
      }

      // Limpiar el formulario reinicializando el estado con todos los campos del modelo
      setForm({
        nombre: "", edad: "", grado: "1", grupo: "",
        frb_asistenciaConsultas: "", frb_complicacionesEmbarazo: "", frb_gestacionMenor34Semanas: "", frb_pesoNacimiento1500g: "", frb_retardoRespiracionCircularCordon: "", frb_hospitalizacionUCIN: "", frb_madreMenor16: "",
        en_alteracionMovilidadCuerpo: "", en_alteracionAsimetriaOjosFacial: "", en_perimetroCefalicoDE: "",
        dev_mg_habilidad1: "", dev_mg_habilidad2: "", dev_mg_habilidad3: "",
        dev_mf_habilidad1: "", dev_mf_habilidad2: "", dev_mf_habilidad3: "",
        dev_len_habilidad1: "", dev_len_habilidad2: "", dev_len_habilidad3: "",
        dev_soc_habilidad1: "", dev_soc_habilidad2: "", dev_soc_habilidad3: "",
        dev_con_escribirNumerosLetras: "", dev_con_completarOracionesOpuesto: "", dev_con_identificaValorMonedas: "",
        sa_doloresCabezaVisionBorrosaMareo: "", sa_dificultadHigieneVestirse: "", sa_miedoAgresionTristeza: "",
        sa_necesitaAcercarseObjetos: "", sa_caeFrecuentementeCorrer: "", sa_orinaCamaNoches: "", sa_distraeFacilmente: "",
        sa_ignoraOtrosNinos: "", sa_perdidaHabilidades: "", sa_erroresPluralesPasado: "",
        sa_noDiceNombreApellido: "", sa_noExpresaEmociones: "", sa_dificultadPinza: "",
        sa_apegoExcesivoPadres: "", sa_juegoSolitario: "",
      });
    } catch (err) {
      console.error("Error al enviar formulario:", err);
      setMensaje("Error al enviar el formulario.");
    }
  };

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="ml-64 p-6 w-full formulario-container">
        <h1 className="formulario-titulo">Evaluación Grupo 14 (49 a 59 meses)</h1>

        <form onSubmit={handleSubmit} className="formulario-card max-w-4xl mx-auto">
          <div className="campo-entrada">
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del niño"
              required
              className="w-full"
            />
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              placeholder="Edad"
              required
              className="w-full"
            />
            <select
              name="grado"
              value={form.grado}
              onChange={handleChange}
              className="w-full"
            >
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
            </select>
            <input
              type="text"
              name="grupo"
              value={form.grupo}
              onChange={handleChange}
              placeholder="Grupo"
              required
              className="w-full"
            />
          </div>
          
          {/* FACTORES DE RIESGO BIOLÓGICO */}
          <h2 className="seccion-titulo">FACTORES DE RIESGO BIOLÓGICO</h2>
          <div className="pregunta-container">
            {[
              { q: "¿La madre fue a más de 2 consultas prenatales?", name: "frb_asistenciaConsultas" },
              { q: "¿Tuvo sangrados, infecciones, presión alta o alguna enfermedad durante el embarazo?", name: "frb_complicacionesEmbarazo" },
              { q: "¿Su bebé nació antes de los 7 meses y medio?", name: "frb_gestacionMenor34Semanas" },
              { q: "¿Su bebé pesó menos de 1500 g al nacer?", name: "frb_pesoNacimiento1500g" },
              { q: "¿Su bebé tardó en respirar o tenía el cordón enredado al nacer?", name: "frb_retardoRespiracionCircularCordon" },
              { q: "¿Estuvo hospitalizado su bebé en UCIN más de 4 días en el primer mes?", name: "frb_hospitalizacionUCIN" },
              { q: "¿Tenía menos de 16 años cuando nació su bebé?", name: "frb_madreMenor16" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>
          
          <h2 className="seccion-titulo">Exploración Neurológica</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Presenta alteración en la movilidad de alguna parte del cuerpo?", name: "en_alteracionMovilidadCuerpo" },
              { q: "¿Presenta alteración o asimetría en la movilidad de ojos o expresión facial?", name: "en_alteracionAsimetriaOjosFacial" },
              { q: "¿Presenta perímetro cefálico fuera de lo normal?", name: "en_perimetroCefalicoDE" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Área Motriz Gruesa</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Sabe darse marometas?", name: "dev_mg_habilidad1" },
              { q: "¿Puede brincar hacia adelante cayendo con los pies juntos?", name: "dev_mg_habilidad2" },
              { q: "¿Puede brincar con un solo pie hacia adelante tres veces cayendo con el mismo pie?", name: "dev_mg_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Área Motriz Fina</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede dibujar un cuadrado?", name: "dev_mf_habilidad1" },
              { q: "¿Sabe escribir 2 o más letras?", name: "dev_mf_habilidad2" },
              { q: "¿Puede dibujar una persona con 4 o más partes del cuerpo?", name: "dev_mf_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Área Lenguaje</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Sabe usar el tiempo futuro?", name: "dev_len_habilidad1" },
              { q: "¿Puede contar cuentos?", name: "dev_len_habilidad2" },
              { q: "Cuando algo le gusta mucho, ¿dice: “dame más”?", name: "dev_len_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Área Social</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede decir el nombre de dos de sus amigos?", name: "dev_soc_habilidad1" },
              { q: "¿Le gusta jugar al papá o mamá o actuar como alguien de su familia?", name: "dev_soc_habilidad2" },
              { q: "¿Se puede bañar solo?", name: "dev_soc_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          {/* Área de Conocimiento */}
          <h2 className="seccion-titulo">Área de Conocimiento</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Reconoce y nombra 4 colores?", name: "dev_con_escribirNumerosLetras" },
              { q: "¿Cuenta hasta 10 correctamente?", name: "dev_con_completarOracionesOpuesto" }, 
              { q: "¿Usa palabras como ayer, hoy, mañana?", name: "dev_con_identificaValorMonedas" } 
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          {/* Señales de Alarma - Mapeando a campos del modelo */}
          <h2 className="seccion-titulo">Señales de Alarma</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Experimenta dolores de cabeza frecuentes, visión borrosa o mareos?", name: "sa_doloresCabezaVisionBorrosaMareo" },
              { q: "¿Tiene dificultad con la higiene personal o para vestirse de forma independiente?", name: "sa_dificultadHigieneVestirse" },
              { q: "¿Muestra miedo excesivo, agresión inusual o tristeza persistente?", name: "sa_miedoAgresionTristeza" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>
          
          {/* Señales de Alerta - Mapeando a campos del modelo */}
          <h2 className="seccion-titulo">Señales de Alerta</h2>
          <div className="pregunta-container">
            {[
              { q: "Usa mal los plurales o tiempo pasado al hablar.", name: "sa_erroresPluralesPasado" },
              { q: "Se distrae fácilmente y no mantiene atención por 5 minutos.", name: "sa_distraeFacilmente" },
              { q: "Muy tímido o demasiado asustado.", name: "sa_miedoAgresionTristeza" },
              { q: "Llora mucho si se separa de los padres.", name: "sa_apegoExcesivoPadres" },
              { q: "No dice correctamente su nombre y apellido.", name: "sa_noDiceNombreApellido" },
              { q: "No expresa bien sus emociones.", name: "sa_noExpresaEmociones" },
              { q: "Es muy pasivo o desinteresado en su entorno.", name: "sa_ignoraOtrosNinos" } 
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} value={form[item.name]} onChange={handleChange} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>
          
          <button
            type="submit"
            className="boton-enviar"
          >
            Enviar
          </button>

          {mensaje && (
            <p className="mensaje-confirmacion">{mensaje}</p>
          )}
        </form>
      </main>
    </div>
  );
}
export default FormularioGrupo14;