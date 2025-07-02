import axios from "./axios";

// Obtener todos los formularios (admin ve todos, maestros solo su grado)
export const getFormulariosRequest = async () => {
  return axios.get("/formularios", { withCredentials: true });
};

// Crear nuevo formulario con respuestas (se calcula color en el backend)
export const createFormularioRequest = async (formulario) => {
  return axios.post("/formularios", formulario, { withCredentials: true });
};

// Obtener un formulario específico por ID (para editar)
export const getFormularioRequest = async (id) => {
  return axios.get(`/formularios/${id}`, { withCredentials: true });
};

// Editar formulario por ID
export const updateFormularioRequest = async (id, data) => {
  return axios.put(`/formularios/${id}`, data, { withCredentials: true });
};

// Eliminar formulario por ID
export const deleteFormularioRequest = async (id) => {
  return axios.delete(`/formularios/${id}`, { withCredentials: true });
};
