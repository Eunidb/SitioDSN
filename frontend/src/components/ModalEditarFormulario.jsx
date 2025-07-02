import { useState, useEffect } from "react";
import '../index.css';

function ModalEditarFormulario({ visible, onClose, onSave, formData }) {
 
  const [formulario, setFormulario] = useState(formData || {}); 
  const [preguntasDinamicas, setPreguntasDinamicas] = useState([]);

  // Effect to update 'formulario' state when 'formData' prop changes (e.g., when a different student is selected)
  useEffect(() => {
    // Ensure we start with a fresh copy of formData to avoid stale closures
    setFormulario(formData || {});
  }, [formData]);

  // Effect to regenerate dynamic questions based on age
  useEffect(() => {
    // Ensure formulario.edad exists and is a valid number before parsing
    const currentEdad = formulario?.edad;
    const edadNumerica = typeof currentEdad === 'string' ? parseInt(currentEdad, 10) : currentEdad;
    const edadEnMeses = edadNumerica ? edadNumerica * 12 : 0; // Assuming 'edad' in formData is in years

    // If 'edad' in formData is already in months, use this:
    // const edadEnMeses = edadNumerica || 0;

    if (edadEnMeses > 0) {
      setPreguntasDinamicas(generarPreguntasSegunEdad(edadEnMeses));
    } else {
      setPreguntasDinamicas([]);
    }
  }, [formulario?.edad]); // Re-run when formulario.edad changes

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formulario);
  };

  const generarPreguntasSegunEdad = (edadEnMeses) => {
    const seccionesDePreguntas = [];
   

    const factoresRiesgoBiologico = [
      { id: 'frb_asistenciaConsultas', label: '¿Acudiste a 2 consultas prenatales o menos?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_complicacionesEmbarazo', label: '¿Tuviste sangrados, infecciones, presión alta o alguna enfermedad en el embarazo?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_gestacionMenor34Semanas', label: '¿El embarazo duró menos de 34 semanas?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_pesoNacimiento1500g', label: '¿Tu bebé pesó 1500 g o menos al nacer?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_retardoRespiracionCircularCordon', label: '¿Tu bebé tardó en respirar o tenía el cordón enredado al nacer?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_hospitalizacionUCIN', label: '¿Tu bebé estuvo hospitalizado en UCIN más de 4 días al nacer o antes del mes?', type: 'select', options: ['SI', 'NO'] },
      { id: 'frb_madreMenor16', label: '¿Tenías menos de 16 años al momento del parto?', type: 'select', options: ['SI', 'NO'] }
    ];

    const exploracionNeurologica = [
      { id: 'en_alteracionMovilidadCuerpo', label: '¿Presenta alteración en la movilidad de alguna parte del cuerpo?', type: 'select', options: ['SI', 'NO'] },
      { id: 'en_alteracionAsimetriaOjosFacial', label: '¿Presenta asimetría en ojos o expresión facial?', type: 'select', options: ['SI', 'NO'] },
      { id: 'en_perimetroCefalicoDE', label: '¿Perímetro cefálico fuera de los valores normales?', type: 'select', options: ['SI', 'NO'] }
    ];

    seccionesDePreguntas.push(
      { titulo: 'FACTORES DE RIESGO BIOLÓGICO', preguntas: factoresRiesgoBiologico },
      { titulo: 'Exploración Neurológica', preguntas: exploracionNeurologica }
    );

    // Group 12 (31-36 months)
    if (edadEnMeses >= 31 && edadEnMeses <= 36) {
      seccionesDePreguntas.push(
        {
          titulo: 'Área Motriz Gruesa',
          preguntas: [
            { id: 'dev_mg_agacharseSinCaer', label: '¿Puede su niño agacharse fácilmente hacia adelante sin caerse?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_caminarPuntaPies', label: '¿Puede su niño caminar sobre la punta de sus pies?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_caminarHaciaAtras', label: '¿Puede caminar hacia atrás?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Motriz Fina',
          preguntas: [
            { id: 'dev_mf_abrocharBoton', label: '¿Puede abrochar un botón de una prenda de vestir?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_levantarBolaPapel', label: '¿Puede levantar una bola pequeña de papel del suelo tomándola con los dedos índice y pulgar?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_imitarTrazos', label: '¿Imita trazos verticales y horizontales?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área de Lenguaje',
          preguntas: [
            { id: 'dev_len_decirEdad', label: '¿Sabe decir su edad?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_hablarEntendible', label: '¿Personas que no lo conocen entienden la mayoría de lo que dice?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_usarPlurales', label: '¿Utiliza plurales como “perros”, “juguetes”, etc.?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Social',
          preguntas: [
            { id: 'dev_soc_jugarConOtrosNinos', label: '¿Juega con otros niños?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_entenderMioTuyo', label: '¿Entiende la diferencia entre “mío” y “tuyo”?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_separarFacilPadres', label: '¿Se separa fácilmente de sus padres?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Señales de Alarma',
          preguntas: [
            { id: 'sa_babeaConstantemente', label: '¿Babea constantemente o habla de manera poco entendible?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_soloPalabrasAisladas', label: '¿Sólo usa palabras aisladas y no frases?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_caeFrecuentementeEscaleras', label: '¿Se cae frecuentemente y le cuesta trabajo subir o bajar escaleras?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_perdidoHabilidades', label: '¿Ha perdido habilidades que antes tenía?', type: 'select', options: ['SI', 'NO'] }
          ]
        }
      );
    }
    // Group 13 (37-48 months)
    else if (edadEnMeses >= 37 && edadEnMeses <= 48) {
      seccionesDePreguntas.push(
        {
          titulo: 'Área Motriz Gruesa',
          preguntas: [
            { id: 'dev_mg_saltarUnPie', label: '¿Salta su niño en un solo pie por lo menos 3 veces sin sujetarse?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_cacharPelotaGrande', label: '¿Puede cachar una pelota grande cuando se la avientan?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_subirBajarEscalerasSolo', label: '¿Sube y baja escaleras sin apoyarse de la pared o barandal?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Motriz Fina',
          preguntas: [
            { id: 'dev_mf_meterAgujeta', label: '¿Puede meter una agujeta por los agujeros de un zapato o cuenta?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_dibujarPersona2Partes', label: '¿Puede dibujar una persona con 2 o más partes del cuerpo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_dibujarCirculoCruz', label: '¿Puede dibujar un círculo o una cruz?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Lenguaje',
          preguntas: [
            { id: 'dev_len_decirLoQueQuiere', label: '¿Le dice lo que quiere con palabras?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_platicarActividades', label: '¿Puede platicarle algo que hizo ayer?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_preguntaFrecuentementePorQue', label: '¿Pregunta frecuentemente “¿por qué?”?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Social',
          preguntas: [
            { id: 'dev_soc_vestirseDesvestirseSolo', label: '¿Puede vestirse y desvestirse solo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_irBanoSolo', label: '¿Puede ir al baño solo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_jugarPersonajes', label: '¿Juega a personajes como papá, mamá, doctor, policías?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área de Conocimiento',
          preguntas: [
            { id: 'dev_con_reconoce4Colores', label: '¿Reconoce y nombra 4 colores?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_con_dice2Numeros', label: '¿Dice nombres de 2 números o más?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_con_cuentaParteCuento', label: '¿Recuerda y cuenta parte de un cuento?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Señales de Alarma',
          preguntas: [
            { id: 'sa_dificultadCopiarCirculo', label: '¿Se le dificulta copiar un círculo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_soloFrases2Palabras', label: '¿Sólo dice frases de 2 palabras?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_perdidoHabilidades', label: '¿Ha perdido habilidades que antes tenía?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'SEÑALES DE ALERTA',
          preguntas: [
            { id: 'sale_cuestaTrabajoTomarLapiz', label: '¿Le cuesta trabajo tomar un lápiz o un crayón con los dedos índice, pulgar y medio?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sale_muyApegadoPadres', label: '¿Es muy apegado a los padres y llora cuando se alejan, y es más notorio que en los otros niños de su edad?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sale_ignoraOtrosNinos', label: 'Cuando está con otros niños, ¿los ignora y prefiere jugar solo?', type: 'select', options: ['SI', 'NO'] }
          ]
        }
      );
    }
    // Group 14 (49-59 months) - Your code has 49-71, let's refine this
    else if (edadEnMeses >= 49 && edadEnMeses <= 59) { // Assuming this is your "group 14"
        seccionesDePreguntas.push(
          {
            titulo: 'Área Motriz Gruesa',
            preguntas: [
              { id: 'dev_mg_darseMarometas', label: '¿Sabe darse marometas?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_mg_brincarAdelantePiesJuntos', label: '¿Puede brincar hacia adelante cayendo con los pies juntos?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_mg_brincarUnPieAdelante', label: '¿Puede brincar con un solo pie hacia adelante tres veces cayendo con el mismo pie?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Área Motriz Fina',
            preguntas: [
              { id: 'dev_mf_dibujarCuadrado', label: '¿Puede dibujar un cuadrado?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_mf_escribir2Letras', label: '¿Sabe escribir 2 o más letras?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_mf_dibujarPersona4Partes', label: '¿Puede dibujar una persona con 4 o más partes del cuerpo?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Área Lenguaje',
            preguntas: [
              { id: 'dev_len_usarTiempoFuturo', label: '¿Sabe usar el tiempo futuro?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_len_contarCuentos', label: '¿Puede contar cuentos?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_len_decirDameMas', label: 'Cuando algo le gusta mucho, ¿dice: “dame más”?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Área Social',
            preguntas: [
              { id: 'dev_soc_nombreDosAmigos', label: '¿Puede decir el nombre de dos de sus amigos?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_soc_jugarPapaMama', label: '¿Le gusta jugar al papá o mamá o actuar como alguien de su familia?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_soc_banarSolo', label: '¿Se puede bañar solo?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Área de Conocimiento',
            preguntas: [
              { id: 'dev_con_reconoce4Colores', label: '¿Reconoce y nombra 4 colores?', type: 'select', options: ['SI', 'NO'] }, // Duplicate ID, ensure unique
              { id: 'dev_con_contarHasta10', label: '¿Cuenta hasta 10 correctamente?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_con_usarPalabrasTiempo', label: '¿Usa palabras como ayer, hoy, mañana?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Área de Autonomía', // This section appears specific to this group
            preguntas: [
              { id: 'dev_aut_vestirseDesvestirseSolo', label: '¿Se viste y desviste solo?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_aut_irAlBanoSolo', label: '¿Va al baño solo?', type: 'select', options: ['SI', 'NO'] },
              { id: 'dev_aut_jugarPersonajesOtrosNinos', label: '¿Juega con otros niños al papá, mamá o algún otro personaje?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Señales de Alarma', // These are actually "Conocimiento" questions based on your description
            preguntas: [
              { id: 'sa_reconocerColores', label: '¿Puede decir el nombre correcto de cuatro colores y los puede reconocer?', type: 'select', options: ['SI', 'NO'] },
              { id: 'sa_contarHastaDiez', label: '¿Puede contar correctamente hasta diez?', type: 'select', options: ['SI', 'NO'] },
              { id: 'sa_usaPalabrasTiempo', label: '¿Utiliza las palabras “ayer”, “hoy” y “mañana”?', type: 'select', options: ['SI', 'NO'] }
            ]
          },
          {
            titulo: 'Señales de Alerta',
            preguntas: [
              { id: 'sale_acercaMuchoObjetos', label: '¿Se acerca mucho a los objetos para verlos?', type: 'select', options: ['SI', 'NO'] },
              { id: 'sale_caeMuchoCorrer', label: '¿Se cae mucho al correr?', type: 'select', options: ['SI', 'NO'] },
              { id: 'sale_orinaCamaNoches', label: '¿Se orina en la cama por las noches?', type: 'select', options: ['SI', 'NO'] },
              { id: 'sale_distraeFacilidad', label: '¿Se distrae con facilidad y le cuesta concentrarse más de 5 minutos?', type: 'select', options: ['SI', 'NO'] }
            ]
          }
        );
    }
    // Group 15 (60-71 months, or up to 6 years)
    else if (edadEnMeses >= 60 && edadEnMeses <= 71) { // Assuming this is your "group 15"
      seccionesDePreguntas.push(
        {
          titulo: 'Área Motriz Gruesa',
          preguntas: [
            { id: 'dev_mg_brincarUnPie', label: '¿Puede brincar 7 veces con un solo pie?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_brincarHaciaAtras', label: '¿Puede brincar hacia atrás con ambos pies juntos?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mg_caminarLineaRecta', label: '¿Camina en línea recta juntando talón y punta del pie?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Motriz Fina',
          preguntas: [
            { id: 'dev_mf_dibujarTriangulo', label: '¿Puede copiar un triángulo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_tocarPuntaPulgar', label: '¿Toca el pulgar con cada dedo de la mano?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_mf_cortarPapelTijeras', label: '¿Recorta en línea recta con tijeras?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Lenguaje',
          preguntas: [
            { id: 'dev_len_hablarClaridad', label: '¿Habla claro para que se le entienda?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_comunicarEmociones', label: '¿Dice cómo se siente con palabras como “feliz” o “triste”?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_len_seguirOrdenesTresPasos', label: '¿Sigue 3 instrucciones seguidas, como “aplaude, dame el lápiz y párate”?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área Social',
          preguntas: [
            { id: 'dev_soc_compartirCosas', label: '¿Comparte sus cosas con otros niños?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_gustoIrEscuela', label: '¿Le gusta ir a la escuela?', type: 'select', options: ['SI', 'NO'] },
            { id: 'dev_soc_esperaTurno', label: '¿Espera su turno al jugar o hablar?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Área de Conocimiento',
          preguntas: [
            { id: 'sa_escribirNumerosLetras', label: '¿Puede escribir 2 letras o números?', type: 'select', options: ['SI', 'NO'] }, // Matches your sample JSON's 'sa_escribirNumerosLetras'
            { id: 'sa_completarOracionesOpuesto', label: '¿Completa frases con palabras contrarias, como “rápido – lento”?', type: 'select', options: ['SI', 'NO'] }, // Matches your sample JSON
            { id: 'sa_identificaValorMonedas', label: '¿Reconoce el valor de monedas o billetes?', type: 'select', options: ['SI', 'NO'] } // Matches your sample JSON
          ]
        },
        {
          titulo: 'Señales de Alarma',
          preguntas: [
            { id: 'sa_doloresCabezaVisionBorrosaMareo', label: '¿Tiene dolores de cabeza, visión borrosa o mareos frecuentes?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_dificultadHigieneVestirse', label: '¿Le cuesta vestirse o lavarse solo?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_miedoAgresionTristeza', label: '¿Se muestra muy miedoso, agresivo o triste más de 3 veces por semana?', type: 'select', options: ['SI', 'NO'] }
          ]
        },
        {
          titulo: 'Señales de Alerta',
          preguntas: [
            { id: 'sa_necesitaAcercarseObjetos', label: '¿Se acerca mucho a los objetos para verlos?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_caeFrecuentementeCorrer', label: '¿Se cae mucho al correr?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_orinaCamaNoches', label: '¿Se orina en la cama por las noches?', type: 'select', options: ['SI', 'NO'] },
            { id: 'sa_distraeFacilmente', label: '¿Se distrae con facilidad y le cuesta concentrarse más de 5 minutos?', type: 'select', options: ['SI', 'NO'] }
          ]
        }
      );
    } else {
      // If age does not fit any defined range
      seccionesDePreguntas.push({
        titulo: 'Información Adicional',
        preguntas: [{ id: 'comentarioAdicional', label: 'Por favor, ingrese comentarios adicionales:', type: 'textarea' }]
      });
    }
    return seccionesDePreguntas;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Formulario</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-subtitle">
          Modifica la información del estudiante
        </p>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field-group">
            <label className="modal-field-label">Nombre</label>
            <input
              name="nombre"
              value={formulario?.nombre || ""}
              onChange={handleChange}
              placeholder="Ingrese el nombre completo"
              className="modal-input"
              type="text"
            />
          </div>
          <div className="modal-field-group">
            <label className="modal-field-label">Edad (en años)</label>
            <input
              name="edad"
              value={formulario?.edad || ""}
              onChange={handleChange}
              placeholder="Ingrese la edad en años" // Clarify input type
              type="number"
              className="modal-input"
              min="0" // Allow 0 for initial state or very young children
              max="6" // Max age for your current ranges
            />
          </div>
          <div className="modal-field-group">
            <label className="modal-field-label">Grado</label>
            <select
              name="grado"
              value={formulario?.grado || ""}
              onChange={handleChange}
              className="modal-select"
            >
              <option value="">Seleccionar grado</option>
              <option value="1">1° Primero</option>
              <option value="2">2° Segundo</option>
              <option value="3">3° Tercero</option>
            </select>
          </div>
          <div className="modal-field-group">
            <label className="modal-field-label">Grupo</label>
            <input
              name="grupo"
              value={formulario?.grupo || ""}
              onChange={handleChange}
              placeholder="Ingrese el grupo (ej: A, B, C)"
              className="modal-input"
              type="text"
            />
          </div>

          {/* --- Renderizado de secciones y preguntas dinámicas --- */}
          {preguntasDinamicas.map((seccion, seccionIndex) => (
            <div key={`seccion-${seccionIndex}`}>
              <h2 className="seccion-titulo">{seccion.titulo}</h2>
              <div className="pregunta-container">
                {seccion.preguntas.map((pregunta, preguntaIndex) => (
                  <label key={`pregunta-${seccionIndex}-${preguntaIndex}`} className="pregunta-texto">
                    {pregunta.label}
                    {pregunta.type === 'text' && (
                      <input
                        name={pregunta.id}
                        // Access directly from 'formulario' as per your original JSON structure
                        value={formulario?.[pregunta.id] || ""}
                        onChange={handleChange} // Use handleChange for direct properties
                        className="modal-input"
                        type="text"
                      />
                    )}
                    {pregunta.type === 'textarea' && (
                      <textarea
                        name={pregunta.id}
                        // Access directly from 'formulario'
                        value={formulario?.[pregunta.id] || ""}
                        onChange={handleChange} // Use handleChange for direct properties
                        className="modal-input"
                        rows="3"
                      ></textarea>
                    )}
                    {pregunta.type === 'select' && (
                      <select
                        name={pregunta.id}
                        // Access directly from 'formulario' as per your original JSON structure
                        // Ensure the value is 'SI' or 'NO' to match the options
                        value={formulario?.[pregunta.id]?.toUpperCase() || ""} // Ensure it matches 'SI'/'NO' and defaults to empty string
                        onChange={handleChange} // Use handleChange for direct properties
                        className="pregunta-select"
                      >
                        <option value="">Selecciona</option>
                        {/* Ensure options match the values you expect ('SI', 'NO') */}
                        {pregunta.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {/* --- Fin de preguntas dinámicas --- */}

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="modal-btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="modal-btn-save">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarFormulario;