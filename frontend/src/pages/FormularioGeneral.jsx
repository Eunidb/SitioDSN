
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Sidebar from "../components/sidebar"; 
import axios from "axios"; 

function FormulariosGeneral() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error al obtener el perfil:", err));
  }, []);

  const formCards = [
    {
      title: "Evaluación 31 - 36 meses (Grupo 12)",
      description: "Formulario para la evaluación del desarrollo infantil para la edad de 2 años y 7 meses a 3 años.",
      link: "/formulario-grupo-general",
    },
    {
      title: "Evaluación 37 - 48 meses (Grupo 13)",
      description: "Formulario para la evaluación del desarrollo infantil para la edad de 3 años y 1 mes a 4 años.",
      link: "/formulario-grupo-13", 
    },
    {
      title: "Evaluación 49 - 59 meses (Grupo 14)",
      description: "Formulario para la evaluación del desarrollo infantil para la edad de 4 años y 1 mes a 4 años y 11 meses.",
      link: "/formulario-grupo-14", 
    },
    {
      title: "Evaluación 60 - 71 meses (Grupo 15)",
      description: "Formulario para la evaluación del desarrollo infantil para la edad de  5 años a 5 años y 11 meses.",
      link: "/formulario-grupo-15", 
    },
  ];

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Selecciona un Formulario de Evaluación</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
              <div className="bg-gray-100 p-4 text-right text-sm text-blue-500 hover:text-blue-600">
                Ir al formulario &rarr;
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default FormulariosGeneral;