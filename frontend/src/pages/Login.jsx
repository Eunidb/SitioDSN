import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../index.css';

function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/login", data, {
        withCredentials: true,
      });
      navigate("/inicio");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-form"
      >
       <h2 className="auth-title">BIENVENIDO ADMIN</h2>
      <p className="auth-subtitle">Introduzca sus credenciales para acceder a su cuenta</p>
      
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Introduce tu correo electrónico"
          className="auth-input"
        />
        
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Introduce tu contraseña"
          className="auth-input"
        />
        <button
          type="submit"
           className="auth-button"
        >
          Inicias Sesion
        </button>
         <div className="auth-link">
        ¿No tienes cuenta?{" "}
        <a href="/register">Regístrate aquí</a>
      </div>
      </form>
    </div>
  );
}

export default Login;
