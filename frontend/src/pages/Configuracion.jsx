import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import '../index.css'; // Asegúrate de importar tu archivo CSS global aquí

function Configuracion() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        // Puedes añadir un estado de error o redirigir aquí si lo deseas
      });
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <h1 className="page-title">Mi Perfil</h1> 

        {user ? (
          <div className="profile-card"> 
            <div className="profile-avatar-container">
             
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}&background=3B82F6&color=fff&size=128&bold=true`}
                alt="User Avatar"
                className="profile-avatar"
              />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{user.username}</h2>
              <p className="profile-role">{user.rol.toUpperCase()}</p>
              <div className="profile-details">
                <p><span className="detail-label">Email:</span> {user.email}</p>

              </div>
            </div>
            {/* <button className="edit-profile-button">Editar Perfil</button> */}
          </div>
        ) : (
          <p className="loading-message">Cargando perfil...</p> // Mensaje de carga
        )}
      </main>
    </div>
  );
}

export default Configuracion;