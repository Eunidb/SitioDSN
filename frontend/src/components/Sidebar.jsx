import { Link, useNavigate, useLocation } from "react-router-dom";
import '../index.css';

import { FaHome, FaUsers, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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
          className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <FaHome className="mr-2" />
          Inicio
        </Link>
        <Link
          to="/estudiantes"
          className={`nav-item ${location.pathname === "/estudiantes" ? "active" : ""}`}
        >
          <FaUsers className="mr-2" />
          Estudiantes
        </Link>
        <Link
          to="/formularios-general"
          className={`nav-item ${location.pathname === "/formularios-general" ? "active" : ""}`}
        >
          <FaFileAlt className="mr-2" />
          Formularios
        </Link>
        <Link
          to="/configuracion"
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