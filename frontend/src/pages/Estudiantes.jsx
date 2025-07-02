import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import "../index.css";

function Estudiantes() {
  const [user, setUser] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener perfil del usuario
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("No autorizado. Redirigiendo...");
        setLoading(false);
      });
  }, []);

  // Obtener formularios/estudiantes
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:3000/api/formularios", {
          withCredentials: true,
        })
        .then((res) => {
          setFormularios(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Error cargando estudiantes");
          setLoading(false);
        });
    }
  }, [user]);

  // Función para filtrar estudiantes según el rol del usuario
  const getFilteredEstudiantes = () => {
    if (!user) return [];
    
    if (user.rol === "admin") {
      return formularios; // Admin puede ver todos
    }
    
    if (user.rol.startsWith("maestro")) {
      const gradoMaestro = user.rol.replace("maestro", "");
      return formularios.filter(f => f.grado === gradoMaestro);
    }
    
    return formularios;
  };

  if (loading) return <p className="loading-message">Cargando estudiantes...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">Cargando perfil...</p>;

  const estudiantesFiltrados = getFilteredEstudiantes();

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <h1 className="page-title">
          Lista de Estudiantes
        </h1>
        
        <div className="students-counter">
          <p className="counter-text">
            Total de estudiantes: <span className="counter-number">{estudiantesFiltrados.length}</span>
          </p>
        </div>
          {/* Resumen por estado */}
        <div className="stats-container">
          <div className="stat-card stat-verde">
            <h3 className="stat-title">Estado Verde</h3>
            <p className="stat-number">
              {estudiantesFiltrados.filter(e => e.color === "verde").length}
            </p>
          </div>
          <div className="stat-card stat-amarillo">
            <h3 className="stat-title">Estado Amarillo</h3>
            <p className="stat-number">
              {estudiantesFiltrados.filter(e => e.color === "amarillo").length}
            </p>
          </div>
          <div className="stat-card stat-rojo">
            <h3 className="stat-title">Estado Rojo</h3>
            <p className="stat-number">
              {estudiantesFiltrados.filter(e => e.color === "rojo").length}
            </p>
          </div>
        </div>
        
        {/* Tabla de estudiantes */}
        <div className="students-table-container">
          {estudiantesFiltrados.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No hay estudiantes registrados.</p>
            </div>
          ) : (
            <table className="students-table">
              <thead className="table-header">
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Grado</th>
                  <th>Grupo</th>
                  <th>Estado</th>
                  <th>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map((estudiante) => (
                  <tr key={estudiante._id} className="table-row">
                    <td className="table-cell student-name">{estudiante.nombre}</td>
                    <td className="table-cell">{estudiante.edad} años</td>
                    <td className="table-cell">{estudiante.grado}</td>
                    <td className="table-cell">{estudiante.grupo}</td>
                    <td className="table-cell">
                      <span className={`status-badge status-${estudiante.color}`}>
                        {estudiante.color.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(estudiante.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      
      </main>
    </div>
  );
}

export default Estudiantes;