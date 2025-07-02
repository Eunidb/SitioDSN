import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import '../index.css';

function Formularios() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    grado: "1",
    grupo: "",
    // Factores de Riesgo Biológico (FRB) - Inicializa con los nombres del esquema
    frb_asistenciaConsultas: "",
    frb_complicacionesEmbarazo: "",
    frb_gestacionMenor34Semanas: "",
    frb_pesoNacimiento1500g: "",
    frb_retardoRespiracionCircularCordon: "",
    frb_hospitalizacionUCIN: "",
    frb_madreMenor16: "",

    // Exploración Neurológica (EN) - Inicializa con los nombres del esquema
    en_alteracionMovilidadCuerpo: "",
    en_alteracionAsimetriaOjosFacial: "",
    en_perimetroCefalicoDE: "",

    // Desarrollo (Motriz Gruesa, Motriz Fina, Lenguaje, Social) - Inicializa con los nombres del esquema
    dev_mg_habilidad1: "",
    dev_mg_habilidad2: "",
    dev_mg_habilidad3: "",
    
    dev_mf_habilidad1: "",
    dev_mf_habilidad2: "",
    dev_mf_habilidad3: "",
    
    dev_len_habilidad1: "",
    dev_len_habilidad2: "",
    dev_len_habilidad3: "",
    
    dev_soc_habilidad1: "",
    dev_soc_habilidad2: "",
    dev_soc_habilidad3: "",

    // Señales de Alarma / Alerta (ALE) - Inicializa con los nombres del esquema
    sa_doloresCabezaVisionBorrosaMareo: "",
    sa_dificultadHigieneVestirse: "",
    sa_miedoAgresionTristeza: "",
    sa_necesitaAcercarseObjetos: "",
    sa_caeFrecuentementeCorrer: "",
    sa_orinaCamaNoches: "",
    sa_distraeFacilmente: "",
    // Señales de Alerta específicas para 31-36 meses (siempre al final de las señales de alarma generales)
    sa_dificultadPinza: "",
    sa_apegoExcesivoPadres: "",
    sa_juegoSolitario: "",
    // Campo que parece haberse añadido en tu modelo para 49-59 meses, pero lo incluyo por si es general
    sa_perdidaHabilidades: "" // Asegúrate de que este campo exista en tu modelo si lo estás usando
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

    // Usar los nombres del esquema para la evaluación
    const motriz = [respuestas.dev_mg_habilidad1, respuestas.dev_mg_habilidad2, respuestas.dev_mg_habilidad3];
    const fina = [respuestas.dev_mf_habilidad1, respuestas.dev_mf_habilidad2, respuestas.dev_mf_habilidad3];
    const lenguaje = [respuestas.dev_len_habilidad1, respuestas.dev_len_habilidad2, respuestas.dev_len_habilidad3];
    const social = [respuestas.dev_soc_habilidad1, respuestas.dev_soc_habilidad2, respuestas.dev_soc_habilidad3];
    
    // Señales de Alarma y Alerta para la evaluación de color
    const senalesAlarma = [
        respuestas.sa_doloresCabezaVisionBorrosaMareo, 
        respuestas.sa_dificultadHigieneVestirse, 
        respuestas.sa_miedoAgresionTristeza, 
        respuestas.sa_necesitaAcercarseObjetos,
        respuestas.sa_caeFrecuentementeCorrer,
        respuestas.sa_orinaCamaNoches,
        respuestas.sa_distraeFacilmente,
        respuestas.sa_perdidaHabilidades 
    ];
    const senalesAlerta31_36 = [
        respuestas.sa_dificultadPinza, 
        respuestas.sa_apegoExcesivoPadres, 
        respuestas.sa_juegoSolitario
    ];
    const neuro = [respuestas.en_alteracionMovilidadCuerpo, respuestas.en_alteracionAsimetriaOjosFacial, respuestas.en_perimetroCefalicoDE];
    const frb = [
        respuestas.frb_asistenciaConsultas, 
        respuestas.frb_complicacionesEmbarazo, 
        respuestas.frb_gestacionMenor34Semanas, 
        respuestas.frb_pesoNacimiento1500g, 
        respuestas.frb_retardoRespiracionCircularCordon, 
        respuestas.frb_hospitalizacionUCIN, 
        respuestas.frb_madreMenor16
    ];


    const areaColor = (respuestasArea) => {
      const si = contarSi(respuestasArea);
      // Ajusta las condiciones si un solo 'SI' ya es amarillo o rojo para un área específica
      return si >= 2 ? "verde" : si === 1 ? "amarillo" : "rojo";
    };

    const resultados = [
      areaColor(motriz),
      areaColor(fina),
      areaColor(lenguaje),
      areaColor(social),
    ];

    // Cualquier "SI" en señales de alarma/alerta, en neuro, o 3 o más en FRB resulta en rojo.
    // Además, si alguna de las áreas de desarrollo da 'rojo', el resultado final es 'rojo'.
    const alarmaRoja = senalesAlarma.includes("SI") || senalesAlerta31_36.includes("SI") || neuro.includes("SI") || contarSi(frb) >= 3;

    if (alarmaRoja) return "rojo";
    if (resultados.includes("rojo")) return "rojo"; // Si alguna área de desarrollo es roja
    if (resultados.includes("amarillo")) return "amarillo"; // Si alguna área de desarrollo es amarilla

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

          // Señales de Alarma / Alerta
          sa_doloresCabezaVisionBorrosaMareo: form.sa_doloresCabezaVisionBorrosaMareo,
          sa_dificultadHigieneVestirse: form.sa_dificultadHigieneVestirse,
          sa_miedoAgresionTristeza: form.sa_miedoAgresionTristeza,
          sa_necesitaAcercarseObjetos: form.sa_necesitaAcercarseObjetos,
          sa_caeFrecuentementeCorrer: form.sa_caeFrecuentementeCorrer,
          sa_orinaCamaNoches: form.sa_orinaCamaNoches,
          sa_distraeFacilmente: form.sa_distraeFacilmente,
          sa_dificultadPinza: form.sa_dificultadPinza,
          sa_apegoExcesivoPadres: form.sa_apegoExcesivoPadres,
          sa_juegoSolitario: form.sa_juegoSolitario,
          sa_perdidaHabilidades: form.sa_perdidaHabilidades 
        },
        { withCredentials: true }
      );
      setMensaje(`Formulario enviado correctamente. Color: ${colorEvaluado}`);
      // Limpiar el formulario (re-inicializa todo el estado)
      setForm({
        nombre: "",
        edad: "",
        grado: "1",
        grupo: "",
        frb_asistenciaConsultas: "", frb_complicacionesEmbarazo: "", frb_gestacionMenor34Semanas: "", frb_pesoNacimiento1500g: "", frb_retardoRespiracionCircularCordon: "", frb_hospitalizacionUCIN: "", frb_madreMenor16: "",
        en_alteracionMovilidadCuerpo: "", en_alteracionAsimetriaOjosFacial: "", en_perimetroCefalicoDE: "",
        dev_mg_habilidad1: "", dev_mg_habilidad2: "", dev_mg_habilidad3: "",
        dev_mf_habilidad1: "", dev_mf_habilidad2: "", dev_mf_habilidad3: "",
        dev_len_habilidad1: "", dev_len_habilidad2: "", dev_len_habilidad3: "",
        dev_soc_habilidad1: "", dev_soc_habilidad2: "", dev_soc_habilidad3: "",
        sa_doloresCabezaVisionBorrosaMareo: "", sa_dificultadHigieneVestirse: "", sa_miedoAgresionTristeza: "", sa_necesitaAcercarseObjetos: "", sa_caeFrecuentementeCorrer: "", sa_orinaCamaNoches: "", sa_distraeFacilmente: "",
        sa_dificultadPinza: "", sa_apegoExcesivoPadres: "", sa_juegoSolitario: "",
        sa_perdidaHabilidades: "" // Limpia también este campo si lo usas
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
        <h1 className="formulario-titulo">Registrar Evaluación 31–36 meses</h1>

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
          <h2 className="seccion-titulo">Factores de riesgo biológico</h2>
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
          {/* === EXPLORACIÓN NEUROLÓGICA === */}
          <h2 className="seccion-titulo">Exploración Neurológica</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Presenta alteración en la movilidad de alguna parte del cuerpo?", name: "en_alteracionMovilidadCuerpo" },
              { q: "¿Presenta asimetría en ojos o expresión facial?", name: "en_alteracionAsimetriaOjosFacial" },
              { q: "¿Perímetro cefálico fuera de los valores normales?", name: "en_perimetroCefalicoDE" }
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
          {/* === MOTRIZ GRUESA === */}
          <h2 className="seccion-titulo">Área Motriz Gruesa</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede su niño agacharse hacia adelante sin caerse?", name: "dev_mg_habilidad1" },
              { q: "¿Puede su niño caminar sobre la punta de sus pies?", name: "dev_mg_habilidad2" },
              { q: "¿Puede caminar hacia atrás?", name: "dev_mg_habilidad3" }
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
          {/* === MOTRIZ FINA === */}
          <h2 className="seccion-titulo">Área Motriz Fina</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede abrochar un botón de una prenda de vestir?", name: "dev_mf_habilidad1" },
              { q: "¿Puede levantar una bola pequeña de papel del suelo tomándola con los dedos índice y pulgar?", name: "dev_mf_habilidad2" },
              { q: "¿Imita trazos verticales y horizontales?", name: "dev_mf_habilidad3" }
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
          {/* === LENGUAJE === */}
          <h2 className="seccion-titulo">Área de Lenguaje</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Sabe decir su edad?", name: "dev_len_habilidad1" },
              { q: "Cuando está con personas que no conoce, ¿éstas entienden la mayoría de las palabras que dice?", name: "dev_len_habilidad2" },
              { q: "Cuando habla, ¿utiliza el plural de las palabras: “perros”, “juguetes”, “niños”, etc.?", name: "dev_len_habilidad3" }
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
          {/* === SOCIAL === */}
          <h2 className="seccion-titulo">Área Social</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Juega con otros niños?", name: "dev_soc_habilidad1" },
              { q: "¿Entiende la diferencia entre “mío” y “tuyo”?", name: "dev_soc_habilidad2" },
              { q: "¿Se separa fácilmente de sus padres?", name: "dev_soc_habilidad3" }
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
          {/* === SEÑALES DE ALARMA === */}
          <h2 className="seccion-titulo">Señales de Alarma</h2>
          <div className="pregunta-container">
            {[
            
              { q: "¿Babea constantemente o habla de manera poco entendible?", name: "sa_doloresCabezaVisionBorrosaMareo" }, 
              { q: "¿Sólo usa palabras aisladas y no frases?", name: "sa_dificultadHigieneVestirse" }, 
              { q: "¿Se cae frecuentemente y le cuesta trabajo subir o bajar escaleras?", name: "sa_caeFrecuentementeCorrer" },
              { q: "¿Ha perdido habilidades que antes tenía?", name: "sa_perdidaHabilidades" }
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
          {/* === SEÑALES DE ALERTA (ESPECÍFICAS 31-36 MESES) === */}
          <h2 className="seccion-titulo">Señales de Alerta (31-36 meses)</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Le cuesta trabajo tomar un lápiz o un crayón con los dedos índice, pulgar y medio?", name: "sa_dificultadPinza" },
              { q: "¿Es muy apegado a los padres y llora cuando se alejan, y es más notorio que en los otros niños de su edad?", name: "sa_apegoExcesivoPadres" },
              { q: "Cuando está con otros niños, ¿los ignora y prefiere jugar solo?", name: "sa_juegoSolitario" }
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
export default Formularios;