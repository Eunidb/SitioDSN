import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../index.css';

function Register() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/register", data, {
        withCredentials: true,
      });
      navigate("/inicio");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-form"
      >
        <h2 className="auth-title">REGISTRO DE USUARIO</h2>
      <p className="auth-subtitle">Crea tu cuenta para acceder al sistema</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Introduce tu nombre de usuario"
          {...register("username", { required: true })}
            className="auth-input"
        />

        <input
          type="email"
          placeholder="Introduce tu correo electrónico"
          {...register("email", { required: true })}
            className="auth-input"
        />

        <input
          type="password"
          placeholder="Introduce tu contraseña"
          {...register("password", { required: true })}
            className="auth-input"
        />

        <select
          {...register("rol", { required: true })}
          className="auth-select"
        >
          <option value="">Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="maestro1">Maestro 1°</option>
          <option value="maestro2">Maestro 2°</option>
          <option value="maestro3">Maestro 3°</option>
        </select>

        <button
          type="submit"
          className="auth-button register"
        >
          Registrar
        </button>

        <div className="auth-link">
        ¿Ya tienes cuenta?{" "}
        <a href="/login">Inicia sesión aquí</a>
      </div>
      </form>
    </div>
  );
}


export default Register;
