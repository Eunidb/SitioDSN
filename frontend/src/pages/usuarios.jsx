import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaIdCard,
} from 'react-icons/fa';

import Sidebar from "../components/sidebar";

const UserManagementPage = () => { 
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'maestro1',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

 
  const API_URL = 'http://localhost:3000/api/users'; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
       
          const res = await axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No autorizado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }


      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');

        await axios.delete(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId));
        alert('Usuario eliminado correctamente.');
      } catch (err) {
        setError('Error al eliminar usuario: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsAddingNew(false);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      rol: user.rol,
    });
    setError(null);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setIsAddingNew(true);
    setFormData({
      username: '',
      email: '',
      password: '',
      rol: 'maestro1',
    });
    setError(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (isAddingNew) {
        // Add new user: POST /api/users
        await axios.post(`${API_URL}/users`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Usuario agregado correctamente.');
      } else {
        // Update existing user: PUT /api/users/:id
        const dataToSend = formData.password ? formData : { username: formData.username, email: formData.email, rol: formData.rol };
        await axios.put(`${API_URL}/users/${editingUser._id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Usuario actualizado correctamente.');
      }
      setEditingUser(null);
      setIsAddingNew(false);
      setFormData({ username: '', email: '', password: '', rol: 'maestro1' });
      fetchUsers();
    } catch (err) {
      setError('Error al guardar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsAddingNew(false);
    setFormData({ username: '', email: '', password: '', rol: 'maestro1' });
    setError(null);
  };

  if (loading) {
    return <div className="loading-message">Cargando usuarios...</div>;
  }

  return (
    <div className="flex">
      <Sidebar user={currentUser} />
      <main className="main-content">
        <h1 className="page-title">Administración de Usuarios</h1>

        {error && <div className="error-message">Error: {error}</div>}

        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddClick}
            className="add-user-button"
          >
            {/* CAMBIO: Usar FaUserPlus directamente */}
            <FaUserPlus className="mr-2" /> Agregar Nuevo Usuario
          </button>
        </div>

        {(editingUser || isAddingNew) && (
          <div className="form-card">
            <h2 className="form-title">
              {isAddingNew ? 'Agregar Nuevo Usuario' : `Editar Usuario: ${editingUser.username}`}
            </h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  {isAddingNew ? 'Contraseña:' : 'Nueva Contraseña (opcional):'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="form-input"
                  required={isAddingNew}
                  autoComplete={isAddingNew ? "new-password" : "off"}
                />
                {!isAddingNew && (
                  <p className="password-hint">Deja en blanco para no cambiar la contraseña actual.</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="rol">Rol:</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleFormChange}
                  className="form-input"
                >
                  <option value="admin">Administrador</option>
                  <option value="maestro1">Maestro 1</option>
                  <option value="maestro2">Maestro 2</option>
                  <option value="maestro3">Maestro 3</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="button-primary"
                >
                  {isAddingNew ? 'Agregar Usuario' : 'Actualizar Usuario'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="button-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="user-cards-container">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="user-card">
                <h3 className="user-card-title">
                  {/* CAMBIO: Usar FaUser directamente */}
                  <FaUser className="mr-2" /> {user.username}
                </h3>
                <p className="user-card-detail">
                  {/* CAMBIO: Usar FaEnvelope directamente */}
                  <FaEnvelope className="mr-2" /> {user.email}
                </p>
                <p className="user-card-detail">
                  {/* CAMBIO: Usar FaIdCard directamente */}
                  <FaIdCard className="mr-2" /> Rol: {user.rol}
                </p>
                <div className="user-card-actions">
                  <button
                    onClick={() => handleEdit(user)}
                    className="button-edit"
                  >
                    {/* CAMBIO: Usar FaEdit directamente */}
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="button-delete"
                  >
                    {/* CAMBIO: Usar FaTrash directamente */}
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users-message">No hay usuarios para mostrar.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;