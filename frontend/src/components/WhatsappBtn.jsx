import { useState } from 'react'
import '../pages/styles/WhatsApp.css' 
import logo from '../assets/LogoJoyeria.jpg'

function WhatsappBtn() {
  const [mostrarGlobo, setMostrarGlobo] = useState(true);


  const telefono = import.meta.env.VITE_WHATSAPP_NUMBER || ''; 
  const mensaje = "Hola, estoy interesado en un accesorio que vi en su catalogo web.";
  
  // Crea el link oficial de WhatsApp API
  const linkWhatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="wa-container">
      
      {/* 1. EL GLOBITO DE TEXTO (Solo se muestra si 'mostrarGlobo' es true) */}
      {mostrarGlobo && (
        <div className="wa-globo">
          <div className="wa-header">
            <span>¿Tienes dudas? Comunícate con nosotros vía WhatsApp</span>
            {/* Botón X para cerrar el globo */}
            <button onClick={() => setMostrarGlobo(false)} className="wa-close">×</button>
          </div>
          <div className="wa-body">
            <div className="wa-brand">
              <div className="wa-avatar"><img src={logo} alt="JA" className="logo-wa-button" /></div> 
              <div className="wa-name">
                <span>Joyería con Alma</span>
                <small>Responde en menos de 1 hora</small>
              </div>
            </div>
            <a href={linkWhatsapp} target="_blank" rel="noreferrer" className="wa-btn-chat">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" width="20" />
              Iniciar Chat
            </a>
          </div>
        </div>
      )}

      {/* 2. EL BOTÓN FLOTANTE */}
      <a href={linkWhatsapp} target="_blank" rel="noreferrer" className="wa-floating-btn">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="Contactar por WhatsApp" 
        />
      </a>
    </div>
  )
}

export default WhatsappBtn