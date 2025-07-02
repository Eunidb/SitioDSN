import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import img3 from '../img/img3.jpg';
import img2 from '../img/img2.jpg';
import carrusel1 from '../img/carrusel1.jfif';
import img4 from "../img/img4.jfif";
import equipo from "../img/equipo.jfif";
import '../index.css'; 

// Imágenes de ejemplo para el carrusel
const carouselImages = [
  img3,
  img2,
  carrusel1,
  img4, 
  equipo
];

function Inicio() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Lógica del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % carouselImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Lógica para ocultar/mostrar el header al scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) { 
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`inicio-header ${showHeader ? 'header-visible' : 'header-hidden'}`}>
        <div className="inicio-header-logo">
          Enfermería UTT
        </div>
        <nav className="inicio-nav-links">
          <a href="#inicio-section">Inicio</a>
          <a href="#nosotros-section">Sobre Nosotros</a>
          <a href="#proposito-section">Propósito</a>
          <a href="#alcance-section">Alcance</a>
          <Link to="/Dashboard">Panel de control</Link> 
        </nav>
      </header>

      <main className="flex-grow pt-16" id="inicio-section">
        {/* Carrusel */}
        <div className="carousel-container">
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Carrusel ${index + 1}`}
              className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
          <div className="carousel-overlay">
            <div className="carousel-content">
              <h1 className="carousel-title">Desarrollo Infantil Integral</h1>
              <p className="carousel-subtitle">Evaluación y seguimiento del desarrollo en niños de preescolar</p>
              <Link to="/Dashboard" className="carousel-btn">Comenzar Evaluación</Link>
            </div>
          </div>
        </div>

        {/* Sección Sobre Nosotros */}
        <section id="nosotros-section" className="section-container">
          <div className="section-content">
            <h2 className="section-title">Sobre Nosotros</h2>
            <div className="section-text">
              <p>
                Somos un grupo de estudiantes de enfermería de la Universidad Tecnológica de Tehuacán comprometidos con el desarrollo integral de la primera infancia. Reconociendo la importancia crucial de los primeros años en la formación del ser humano, hemos creado este sitio web especializado en el desarrollo motriz fino, motriz grueso y social de niños en edad preescolar.
              </p>
              <p>
                Como futuros profesionales de la salud, entendemos que la detección temprana y el estímulo adecuado del desarrollo infantil son fundamentales para prevenir dificultades futuras y potenciar las habilidades de cada niño. A través de este proyecto, aplicamos nuestros conocimientos académicos en un contexto real, combinando la teoría aprendida en las aulas con la práctica comunitaria.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Propósito */}
        <section id="proposito-section" className="section-container alt-bg">
          <div className="section-content">
            <h2 className="section-title">Propósito</h2>
            <div className="section-text">
              <p>
                Nuestro principal propósito es proporcionar a los maestros de educación preescolar una herramienta digital especializada para evaluar y monitorear el desarrollo integral de los niños en sus primeros años de vida. A través de formularios estructurados y científicamente fundamentados, buscamos facilitar la identificación temprana de posibles retrasos o dificultades en el desarrollo.
              </p>
              <p>
                Este sitio web está diseñado para ser un puente entre la teoría académica de enfermería y la práctica educativa, ofreciendo recursos valiosos que permitan a los educadores tomar decisiones informadas sobre el desarrollo de cada niño bajo su cuidado.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Alcance */}
        <section id="alcance-section" className="section-container">
          <div className="section-content">
            <h2 className="section-title">Alcance</h2>
            <div className="section-text">
              <p>
                El alcance de esta plataforma abarca la evaluación integral del desarrollo infantil en niños de 3 a 6 años de edad, enfocándose en tres áreas fundamentales: desarrollo motriz fino, desarrollo motriz grueso y desarrollo social. La herramienta está dirigida principalmente a maestros y educadores de instituciones preescolares que buscan un método sistemático para el seguimiento del crecimiento de sus estudiantes.
              </p>
              <p>
                Nuestro alcance incluye la generación de reportes detallados, recomendaciones personalizadas y el establecimiento de un sistema de seguimiento continuo que permita a los educadores y padres de familia trabajar de manera colaborativa en el desarrollo óptimo de cada niño.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Enfermería UTT</h3>
            <ul>
              <li><a href="#inicio-section">Inicio</a></li>
              <li><a href="#nosotros-section">Sobre Nosotros</a></li>
              <li><a href="#proposito-section">Propósito</a></li>
              <li><a href="#alcance-section">Alcance</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li>Teléfono: +52 238 115 8080</li>
              <li>Email: contacto@enfermeriautt.edu.mx</li>
              <li>Dirección: Prolongación de la 1 sur No. 1101 San Pablo Tepetzingo C.P. 75859 Tehuacán, Puebla</li> 
            </ul>
          </div>
          <div className="footer-column">
            <h3>Síguenos</h3>
            <ul>
              <li><a href="#!">Facebook</a></li>
              <li><a href="#!">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Enfermería UTT. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Inicio;