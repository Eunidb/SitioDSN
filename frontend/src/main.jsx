
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Inicio from "./pages/Inicio.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Estudiantes from "./pages/Estudiantes.jsx";
import Formularios from "./pages/Formularios.jsx";
import FormulariosGeneral from "./pages/FormularioGeneral.jsx";
import FormularioGrupo13 from "./pages/FormularioGrupo13.jsx";
import FormularioGrupo14 from "./pages/FormularioGrupo14.jsx";
import FormularioGrupo15 from "./pages/FormularioGrupo15.jsx";

import Configuracion from "./pages/Configuracion.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/" element={<FormulariosGeneral />} /> 
        <Route path="/formularios-general" element={<FormulariosGeneral />} />
        <Route path="/formulario-grupo-general" element={<Formularios />} /> 
        <Route path="/formulario-grupo-13" element={<FormularioGrupo13 />} />
        <Route path="/formulario-grupo-14" element={<FormularioGrupo14 />} /> 
        <Route path="/formulario-grupo-15" element={<FormularioGrupo15 />} />
        <Route path="/formularios" element={<Formularios />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
