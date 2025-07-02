import { Link, useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import '../index.css';

// Import icons from react-icons (assuming you've installed it as discussed previously)
import { FaHome, FaUsers, FaUserCog, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';

function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene el objeto de ubicación actual

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-blue-800 text-white flex flex-col p-4 fixed">
      <h2 className="text-2xl font-bold mb-8">Panel de control</h2>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          // Aplica 'active' si la ruta actual es '/dashboard'
          className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <FaHome className="mr-2" />
          Inicio
        </Link>
        <Link
          to="/estudiantes"
          // Aplica 'active' si la ruta actual es '/estudiantes'
          className={`nav-item ${location.pathname === "/estudiantes" ? "active" : ""}`}
        >
          <FaUsers className="mr-2" />
          Estudiantes
        </Link>

        {user?.rol === "admin" && (
          <Link
            to="/usuarios"
            // Aplica 'active' si la ruta actual es '/usuarios'
            className={`nav-item ${location.pathname === "/usuarios" ? "active" : ""}`}
          >
            <FaUserCog className="mr-2" />
            Usuarios
          </Link>
        )}

        <Link
          to="/formularios-general"
          // Aplica 'active' si la ruta actual es '/formularios-general'
          className={`nav-item ${location.pathname === "/formularios-general" ? "active" : ""}`}
        >
          <FaFileAlt className="mr-2" />
          Formularios
        </Link>
        <Link
          to="/configuracion"
          // Aplica 'active' si la ruta actual es '/configuracion'
          className={`nav-item ${location.pathname === "/configuracion" ? "active" : ""}`}
        >
          <FaCog className="mr-2" />
          Configuración
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="logout-button"
      >
        <FaSignOutAlt className="mr-2" />
        Cerrar sesión
      </button>
    </div>
  );
}

export default Sidebar;