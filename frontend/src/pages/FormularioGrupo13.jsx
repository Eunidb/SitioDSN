import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import '../index.css';

function FormularioGrupo13() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    grado: "1",
    grupo: "",
    // Factores de Riesgo Biológico (FRB) - Usar nombres de campo del esquema
    frb_asistenciaConsultas: "",
    frb_complicacionesEmbarazo: "",
    frb_gestacionMenor34Semanas: "",
    frb_pesoNacimiento1500g: "",
    frb_retardoRespiracionCircularCordon: "",
    frb_hospitalizacionUCIN: "",
    frb_madreMenor16: "",

    // Exploración Neurológica (EN) - Usar nombres de campo del esquema
    en_alteracionMovilidadCuerpo: "",
    en_asimetriaOjosFacial: "", // Asumo nuevo nombre para este grupo
    en_perimetroCefalicoNormal: "", // Asumo nuevo nombre para este grupo

    // Desarrollo - Motriz Gruesa (DMG)
    dev_mg_saltaUnPie: "",
    dev_mg_cachaPelotaGrande: "",
    dev_mg_subeBajaEscalerasSolo: "",

    // Desarrollo - Motriz Fina (DMF)
    dev_mf_meteAgujeta: "",
    dev_mf_dibujaPersonaPartes: "",
    dev_mf_dibujaCirculoCruz: "",

    // Desarrollo - Lenguaje (DL)
    dev_len_diceLoQueQuiere: "",
    dev_len_platicaAlgoAyer: "",
    dev_len_preguntaPorQue: "",

    // Desarrollo - Social (DS)
    dev_soc_vestirseSolo: "",
    dev_soc_vaBanoSolo: "",
    dev_soc_juegaPersonajes: "",

    // Desarrollo - Conocimiento (DCO)
    dev_con_reconoce4Colores: "",
    dev_con_dice2Numeros: "",
    dev_con_recuerdaCuento: "",

    // Señales de Alarma (SA)
    sa_dificultadCopiarCirculo: "",
    sa_frases2Palabras: "",
    sa_perdidaHabilidades: "", // Mantengo este nombre si es común entre formularios

    // Señales de Alerta (SALE) - Específicas 37-48 meses
    sa_alerta_dificultadLapiz: "", // Nuevo nombre para evitar colisión
    sa_alerta_apegoExcesivo: "",   // Nuevo nombre
    sa_alerta_juegoSolitario: "",  // Nuevo nombre
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

    // Factores de Riesgo Biológico
    const frb = [
      respuestas.frb_asistenciaConsultas,
      respuestas.frb_complicacionesEmbarazo,
      respuestas.frb_gestacionMenor34Semanas,
      respuestas.frb_pesoNacimiento1500g,
      respuestas.frb_retardoRespiracionCircularCordon,
      respuestas.frb_hospitalizacionUCIN,
      respuestas.frb_madreMenor16,
    ];

    // Exploración Neurológica
    const neuro = [
      respuestas.en_alteracionMovilidadCuerpo,
      respuestas.en_asimetriaOjosFacial,
      respuestas.en_perimetroCefalicoNormal,
    ];

    // Desarrollo por áreas
    const motriz = [respuestas.dev_mg_saltaUnPie, respuestas.dev_mg_cachaPelotaGrande, respuestas.dev_mg_subeBajaEscalerasSolo];
    const fina = [respuestas.dev_mf_meteAgujeta, respuestas.dev_mf_dibujaPersonaPartes, respuestas.dev_mf_dibujaCirculoCruz];
    const lenguaje = [respuestas.dev_len_diceLoQueQuiere, respuestas.dev_len_platicaAlgoAyer, respuestas.dev_len_preguntaPorQue];
    const social = [respuestas.dev_soc_vestirseSolo, respuestas.dev_soc_vaBanoSolo, respuestas.dev_soc_juegaPersonajes];
    const conocimiento = [respuestas.dev_con_reconoce4Colores, respuestas.dev_con_dice2Numeros, respuestas.dev_con_recuerdaCuento];

    // Señales de Alarma y Alerta
    const senalesAlarma = [
      respuestas.sa_dificultadCopiarCirculo,
      respuestas.sa_frases2Palabras,
      respuestas.sa_perdidaHabilidades,
    ];
    const senalesAlerta = [
      respuestas.sa_alerta_dificultadLapiz,
      respuestas.sa_alerta_apegoExcesivo,
      respuestas.sa_alerta_juegoSolitario,
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
      contarSi(frb) >= 3 || // 3 o más FRB
      neuro.includes("SI") || // Cualquier SI en Neurológica
      senalesAlarma.includes("SI") || // Cualquier SI en Señales de Alarma
      senalesAlerta.includes("SI") || // Cualquier SI en Señales de Alerta
      resultadosDesarrollo.includes("rojo"); // Algún área de desarrollo es roja

    if (isRojo) return "rojo";

    // Criterios para AMARILLO
    const isAmarillo =
      contarSi(frb) > 0 || // Más de 0 FRB
      resultadosDesarrollo.includes("amarillo"); // Algún área de desarrollo es amarilla

    if (isAmarillo) return "amarillo";

    return "verde";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const colorEvaluado = evaluarColor(form);

    try {
      await axios.post(
        "http://localhost:3000/api/formularios", // Asegúrate que esta ruta maneje todos los campos
        {
          nombre: form.nombre,
          edad: parseInt(form.edad),
          grado: form.grado,
          grupo: form.grupo,
          color: colorEvaluado,
          // --- AÑADIENDO TODOS LOS CAMPOS DEL ESQUEMA AQUÍ ---
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
          en_asimetriaOjosFacial: form.en_asimetriaOjosFacial,
          en_perimetroCefalicoNormal: form.en_perimetroCefalicoNormal,

          // Desarrollo - Motriz Gruesa
          dev_mg_saltaUnPie: form.dev_mg_saltaUnPie,
          dev_mg_cachaPelotaGrande: form.dev_mg_cachaPelotaGrande,
          dev_mg_subeBajaEscalerasSolo: form.dev_mg_subeBajaEscalerasSolo,
          
          // Desarrollo - Motriz Fina
          dev_mf_meteAgujeta: form.dev_mf_meteAgujeta,
          dev_mf_dibujaPersonaPartes: form.dev_mf_dibujaPersonaPartes,
          dev_mf_dibujaCirculoCruz: form.dev_mf_dibujaCirculoCruz,
          
          // Desarrollo - Lenguaje
          dev_len_diceLoQueQuiere: form.dev_len_diceLoQueQuiere,
          dev_len_platicaAlgoAyer: form.dev_len_platicaAlgoAyer,
          dev_len_preguntaPorQue: form.dev_len_preguntaPorQue,
          
          // Desarrollo - Social
          dev_soc_vestirseSolo: form.dev_soc_vestirseSolo,
          dev_soc_vaBanoSolo: form.dev_soc_vaBanoSolo,
          dev_soc_juegaPersonajes: form.dev_soc_juegaPersonajes,

          // Desarrollo - Conocimiento
          dev_con_reconoce4Colores: form.dev_con_reconoce4Colores,
          dev_con_dice2Numeros: form.dev_con_dice2Numeros,
          dev_con_recuerdaCuento: form.dev_con_recuerdaCuento,
          
          // Señales de Alarma
          sa_dificultadCopiarCirculo: form.sa_dificultadCopiarCirculo,
          sa_frases2Palabras: form.sa_frases2Palabras,
          sa_perdidaHabilidades: form.sa_perdidaHabilidades,

          // Señales de Alerta
          sa_alerta_dificultadLapiz: form.sa_alerta_dificultadLapiz,
          sa_alerta_apegoExcesivo: form.sa_alerta_apegoExcesivo,
          sa_alerta_juegoSolitario: form.sa_alerta_juegoSolitario,
        },
        { withCredentials: true }
      );

      // El mensaje de retroalimentación debería basarse en la evaluación del color.
      if (colorEvaluado === "verde") {
        setMensaje("Formulario enviado correctamente. Desarrollo normal.");
      } else {
        // Asumo que "Grupo 12 (31-36 meses)" es la siguiente evaluación a aplicar
        // si hay una señal de alerta o alarma en este grupo.
        setMensaje(`Evaluación en ${colorEvaluado.toUpperCase()}. Se sugiere valoración y seguimiento. Puede que requiera aplicar el grupo anterior si es pertinente.`);
      }

      // Limpiar el formulario reinicializando el estado
      setForm({
        nombre: "", edad: "", grado: "1", grupo: "",
        frb_asistenciaConsultas: "", frb_complicacionesEmbarazo: "", frb_gestacionMenor34Semanas: "", frb_pesoNacimiento1500g: "", frb_retardoRespiracionCircularCordon: "", frb_hospitalizacionUCIN: "", frb_madreMenor16: "",
        en_alteracionMovilidadCuerpo: "", en_asimetriaOjosFacial: "", en_perimetroCefalicoNormal: "",
        dev_mg_saltaUnPie: "", dev_mg_cachaPelotaGrande: "", dev_mg_subeBajaEscalerasSolo: "",
        dev_mf_meteAgujeta: "", dev_mf_dibujaPersonaPartes: "", dev_mf_dibujaCirculoCruz: "",
        dev_len_diceLoQueQuiere: "", dev_len_platicaAlgoAyer: "", dev_len_preguntaPorQue: "",
        dev_soc_vestirseSolo: "", dev_soc_vaBanoSolo: "", dev_soc_juegaPersonajes: "",
        dev_con_reconoce4Colores: "", dev_con_dice2Numeros: "", dev_con_recuerdaCuento: "",
        sa_dificultadCopiarCirculo: "", sa_frases2Palabras: "", sa_perdidaHabilidades: "",
        sa_alerta_dificultadLapiz: "", sa_alerta_apegoExcesivo: "", sa_alerta_juegoSolitario: "",
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
        <h1 className="formulario-titulo">Evaluación Grupo 13 (37 a 48 meses)</h1>

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

          {/* NEUROLÓGICA */}
          <h2 className="seccion-titulo">Exploración Neurológica</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Presenta alteración en la movilidad de alguna parte del cuerpo?", name: "en_alteracionMovilidadCuerpo" },
              { q: "¿Presenta asimetría en ojos o expresión facial?", name: "en_asimetriaOjosFacial" },
              { q: "¿Perímetro cefálico fuera de valores normales?", name: "en_perimetroCefalicoNormal" }
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
              { q: "¿Salta su niño en un solo pie por lo menos 3 veces sin sujetarse?", name: "dev_mg_saltaUnPie" },
              { q: "¿Puede cachar una pelota grande cuando se la avientan?", name: "dev_mg_cachaPelotaGrande" },
              { q: "¿Sube y baja escaleras sin apoyarse de la pared o barandal?", name: "dev_mg_subeBajaEscalerasSolo" }
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
          {/* MOTRIZ FINA */}
          <h2 className="seccion-titulo">Área Motriz Fina</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede meter una agujeta por los agujeros de un zapato o cuenta?", name: "dev_mf_meteAgujeta" },
              { q: "¿Puede dibujar una persona con 2 o más partes del cuerpo?", name: "dev_mf_dibujaPersonaPartes" },
              { q: "¿Puede dibujar un círculo o una cruz?", name: "dev_mf_dibujaCirculoCruz" }
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
          {/* LENGUAJE */}
          <h2 className="seccion-titulo">Área Lenguaje</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Le dice lo que quiere con palabras?", name: "dev_len_diceLoQueQuiere" },
              { q: "¿Puede platicarle algo que hizo ayer?", name: "dev_len_platicaAlgoAyer" },
              { q: "¿Pregunta frecuentemente “¿por qué?”?", name: "dev_len_preguntaPorQue" }
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
          {/* SOCIAL */}
          <h2 className="seccion-titulo">Área Social</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Puede vestirse y desvestirse solo?", name: "dev_soc_vestirseSolo" },
              { q: "¿Puede ir al baño solo?", name: "dev_soc_vaBanoSolo" },
              { q: "¿Juega a personajes como papá, mamá, doctor, policías?", name: "dev_soc_juegaPersonajes" }
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
              { q: "¿Reconoce y nombra 4 colores?", name: "dev_con_reconoce4Colores" },
              { q: "¿Dice nombres de 2 números o más?", name: "dev_con_dice2Numeros" },
              { q: "¿Recuerda y cuenta parte de un cuento?", name: "dev_con_recuerdaCuento" }
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
          {/* SEÑALES DE ALARMA */}
          <h2 className="seccion-titulo">Señales de Alarma</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Se le dificulta copiar un círculo?", name: "sa_dificultadCopiarCirculo" },
              { q: "¿Sólo dice frases de 2 palabras?", name: "sa_frases2Palabras" },
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
          {/* SEÑALES DE ALERTA */}
          <h2 className="seccion-titulo">SEÑALES DE ALERTA</h2>
          <div className="pregunta-container">
            {[
              { q: "¿Le cuesta trabajo tomar un lápiz o un crayón con los dedos índice, pulgar y medio?", name: "sa_alerta_dificultadLapiz" },
              { q: "¿Es muy apegado a los padres y llora cuando se alejan, y es más notorio que en los otros niños de su edad?", name: "sa_alerta_apegoExcesivo" },
              { q: "Cuando está con otros niños, ¿los ignora y prefiere jugar solo?", name: "sa_alerta_juegoSolitario" }
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
export default FormularioGrupo13;