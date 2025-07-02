import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

function FormularioGrupo15() {
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

    // Desarrollo - Motriz Gruesa (DMG)
    dev_mg_habilidad1: "", 
    dev_mg_habilidad2: "", 
    dev_mg_habilidad3: "", 
    
    // Desarrollo - Motriz Fina (DMF)
    dev_mf_habilidad1: "",
    dev_mf_habilidad2: "", 
    dev_mf_habilidad3: "", 
    
    // Desarrollo - Lenguaje (DL)
    dev_len_habilidad1: "", 
    dev_len_habilidad2: "", 
    dev_len_habilidad3: "", 
    
    // Desarrollo - Social (DS)
    dev_soc_habilidad1: "",
    dev_soc_habilidad2: "", 
    dev_soc_habilidad3: "",

    // Desarrollo - Conocimiento (DCO)
    dev_con_escribirNumerosLetras: "",   
    dev_con_completarOracionesOpuesto: "",
    dev_con_identificaValorMonedas: "",

    // Señales de Alarma / Alerta (SA/ALE) 
    sa_doloresCabezaVisionBorrosaMareo: "", 
    sa_dificultadHigieneVestirse: "",    
    sa_miedoAgresionTristeza: "",          
    sa_necesitaAcercarseObjetos: "",     
    sa_caeFrecuentementeCorrer: "",       
    sa_orinaCamaNoches: "",                
    sa_distraeFacilmente: "", 
    sa_ignoraOtrosNinos: "",               
    sa_perdidaHabilidades: "",  
    sa_erroresPluralesPasado: "",
    sa_noDiceNombreApellido: "", 
    sa_noExpresaEmociones: "", 
    sa_dificultadPinza: "", 
    sa_apegoExcesivoPadres: "",
    sa_juegoSolitario: "",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

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

    // Señales de Alarma (SA) - Basadas en las preguntas del formulario 60-71 meses
    const senalesAlarma = [
      respuestas.sa_doloresCabezaVisionBorrosaMareo,
      respuestas.sa_dificultadHigieneVestirse,
      respuestas.sa_miedoAgresionTristeza,
    ];

    // Señales de Alerta (SALE) - Basadas en las preguntas del formulario 60-71 meses
    const senalesAlerta = [
      respuestas.sa_necesitaAcercarseObjetos,
      respuestas.sa_caeFrecuentementeCorrer,
      respuestas.sa_orinaCamaNoches,
      respuestas.sa_distraeFacilmente,
    ];

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
      contarSi(frb) > 0 || 
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
          
          // Señales de Alarma / Alerta (se envían todos los campos del modelo)
          sa_doloresCabezaVisionBorrosaMareo: form.sa_doloresCabezaVisionBorrosaMareo,
          sa_dificultadHigieneVestirse: form.sa_dificultadHigieneVestirse,
          sa_miedoAgresionTristeza: form.sa_miedoAgresionTristeza,
          sa_necesitaAcercarseObjetos: form.sa_necesitaAcercarseObjetos,
          sa_caeFrecuentementeCorrer: form.sa_caeFrecuentementeCorrer,
          sa_orinaCamaNoches: form.sa_orinaCamaNoches,
          sa_distraeFacilmente: form.sa_distraeFacilmente,
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
        setMensaje(`Evaluación en ${colorEvaluado.toUpperCase()}. Redirigiendo a Formulario Grupo 14 (49–59 meses).`);
        setTimeout(() => {
          navigate("/formulario-grupo-14"); // Redirige al formulario del Grupo 14 (49-59 meses)
        }, 2000);
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
        <h1 className="formulario-titulo">Evaluación Grupo 15 (60 a 71 meses)</h1>

        <form onSubmit={handleSubmit} className="formulario-card max-w-4xl mx-auto">
          <div className="campo-entrada">
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del niño" required className="w-full" />
            <input type="number" name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" required className="w-full" />
            <select name="grado" value={form.grado} onChange={handleChange} className="w-full">
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
            </select>
            <input type="text" name="grupo" value={form.grupo} onChange={handleChange} placeholder="Grupo" required className="w-full" />
          </div>

          {/* FACTORES DE RIESGO BIOLÓGICO */}
          <h2 className="seccion-titulo">FACTORES DE RIESGO BIOLÓGICO</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Acudiste a 2 consultas prenatales o menos?", name: "frb_asistenciaConsultas" },
              { q: "¿Tuviste sangrados, infecciones, presión alta o alguna enfermedad en el embarazo?", name: "frb_complicacionesEmbarazo" },
              { q: "¿El embarazo duró menos de 34 semanas?", name: "frb_gestacionMenor34Semanas" },
              { q: "¿Tu bebé pesó 1500 g o menos al nacer?", name: "frb_pesoNacimiento1500g" },
              { q: "¿Tu bebé tardó en respirar o tenía el cordón enredado al nacer?", name: "frb_retardoRespiracionCircularCordon" },
              { q: "¿Tu bebé estuvo hospitalizado en UCIN más de 4 días al nacer o antes del mes?", name: "frb_hospitalizacionUCIN" },
              { q: "¿Tenías menos de 16 años al momento del parto?", name: "frb_madreMenor16" }
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
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
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
              { q: "¿Puede brincar 7 veces con un solo pie?", name: "dev_mg_habilidad1" },
              { q: "¿Puede brincar hacia atrás con ambos pies juntos?", name: "dev_mg_habilidad2" },
              { q: "¿Camina en línea recta juntando talón y punta del pie?", name: "dev_mg_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
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
              { q: "¿Puede copiar un triángulo?", name: "dev_mf_habilidad1" },
              { q: "¿Toca el pulgar con cada dedo de la mano?", name: "dev_mf_habilidad2" },
              { q: "¿Recorta en línea recta con tijeras?", name: "dev_mf_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
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
              { q: "¿Habla claro para que se le entienda?", name: "dev_len_habilidad1" },
              { q: "¿Dice cómo se siente con palabras como “feliz” o “triste”?", name: "dev_len_habilidad2" },
              { q: "¿Sigue 3 instrucciones seguidas, como “aplaude, dame el lápiz y párate”?", name: "dev_len_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
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
              { q: "¿Comparte sus cosas con otros niños?", name: "dev_soc_habilidad1" },
              { q: "¿Le gusta ir a la escuela?", name: "dev_soc_habilidad2" },
              { q: "¿Espera su turno al jugar o hablar?", name: "dev_soc_habilidad3" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Área de Conocimiento</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede escribir 2 letras o números?", name: "dev_con_escribirNumerosLetras" },
              { q: "¿Completa frases con palabras contrarias, como “rápido – lento”?", name: "dev_con_completarOracionesOpuesto" },
              { q: "¿Reconoce el valor de monedas o billetes?", name: "dev_con_identificaValorMonedas" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Señales de Alarma</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Tiene dolores de cabeza, visión borrosa o mareos frecuentes?", name: "sa_doloresCabezaVisionBorrosaMareo" },
              { q: "¿Le cuesta vestirse o lavarse solo?", name: "sa_dificultadHigieneVestirse" },
              { q: "¿Se muestra muy miedoso, agresivo o triste más de 3 veces por semana?", name: "sa_miedoAgresionTristeza" }
            ].map((item, i) => (
              <label key={i} className="pregunta-texto">
                {item.q}
                <select name={item.name} onChange={handleChange} value={form[item.name]} className="pregunta-select">
                  <option value="">Selecciona</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </label>
            ))}
          </div>

          <h2 className="seccion-titulo">Señales de Alerta</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Se acerca mucho a los objetos para verlos?", name: "sa_necesitaAcercarseObjetos" },
              { q: "¿Se cae mucho al correr?", name: "sa_caeFrecuentementeCorrer" },
              { q: "¿Se orina en la cama por las noches?", name: "sa_orinaCamaNoches" },
              { q: "¿Se distrae con facilidad y le cuesta concentrarse más de 5 minutos?", name: "sa_distraeFacilmente" }
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

          <button type="submit" className="boton-enviar">
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

export default FormularioGrupo15;