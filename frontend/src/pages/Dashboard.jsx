import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi"; // Importar iconos
import Sidebar from "../components/sidebar";
import ModalEditarFormulario from "../components/ModalEditarFormulario";
import "../index.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [error, setError] = useState("");

  const [editingForm, setEditingForm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Obtener perfil del usuario
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setError("No autorizado. Redirigiendo..."));
  }, []);

  // Obtener formularios
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:3000/api/formularios", {
          withCredentials: true,
        })
        .then((res) => {
          setFormularios(res.data);
        })
        .catch(() => setError("Error cargando formularios"));
    }
  }, [user]);

  const handleEliminar = async (id) => {
    // Confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que quieres eliminar este formulario?")) {
      try {
        await axios.delete(`http://localhost:3000/api/formularios/${id}`, {
          withCredentials: true,
        });
        setFormularios((prev) => prev.filter((f) => f._id !== id));
      } catch {
        alert("No se pudo eliminar.");
      }
    }
  };

  const handleEditar = (formulario) => {
    setEditingForm(formulario);
    setModalVisible(true);
  };

  const handleGuardar = async (formularioActualizado) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/formularios/${formularioActualizado._id}`,
        formularioActualizado,
        { withCredentials: true }
      );

      setFormularios((prev) =>
        prev.map((f) => (f._id === res.data._id ? res.data : f))
      );

      setModalVisible(false);
    } catch {
      alert("Error al guardar cambios");
    }
  };

  // Función para verificar si el usuario puede editar/eliminar el formulario
  const canEditDelete = (formulario) => {
    if (user.rol === "admin") return true;
    if (user.rol.startsWith("maestro")) {
      const gradoMaestro = user.rol.replace("maestro", "");
      return formulario.grado === gradoMaestro;
    }
    return false;
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">Cargando perfil...</p>;

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <h1 className="page-title">
          Bienvenido, {user.username} ({user.rol})
        </h1>

        {/* Lista de formularios */}
        <div className="students-table-container">
          <table className="students-table">
            <thead className="table-header">
              <tr>
                <th className="p-2">Nombre</th>
                <th>Edad</th>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Color</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formularios.map((f) => (
                <tr key={f._id} className="table-row">
                  <td className="table-cell">{f.nombre}</td>
                  <td>{f.edad}</td>
                  <td>{f.grado}</td>
                  <td>{f.grupo}</td>
                  <td
                    className={`font-bold ${
                      f.color === "verde"
                        ? "text-green-600"
                        : f.color === "amarillo"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {f.color.toUpperCase()}
                  </td>
                  <td>{new Date(f.fecha).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    {canEditDelete(f) ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditar(f)}
                          className="icon-button edit-icon"
                          title="Editar formulario"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminar(f._id)}
                          className="icon-button delete-icon"
                          title="Eliminar formulario"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ModalEditarFormulario
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleGuardar}
        formData={editingForm}
      />
    </div>
  );
}

export default Dashboard;