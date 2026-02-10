import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import WhatsappBtn from '../components/WhatsappBtn'
import './styles/App.css'

import faceLogoImg from '../assets/face-logo.png' 
import aboutUsImg from '../assets/creadora.png'

function Catalogo() {
  const [joyas, setJoyas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);
  const [slides, setSlides] = useState([])


  // EFECTO CARRUSEL
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(intervalo); 
  }, [slides.length]);


  // CARGA DE PRODUCTOS Y SLIDES
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/productos`) 
      .then(response => {
        setJoyas(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setCargando(false); 
      })

      axios.get(`${import.meta.env.VITE_API_URL}/api/slides`)
       .then(response =>{
         setSlides(response.data);
       })
       .catch(error => {
        console.error("Error: ", error);
       })

  }, [])

  // BUSQUEDA DE PRODUCTOS
  const joyasFiltradas = joyas.filter(joya => 
    joya.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // PANEL VER DETALLES 
  const abrirModal = (joya) => {
    setProductoSeleccionado(joya);  
    document.body.style.overflow = 'hidden';
  }

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    document.body.style.overflow = 'auto'; // Reactivar scroll
  }

  // EFECTO SCROLL REVEAL
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Cuando el elemento entra en pantalla, le agregamos la clase 'visible'
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    });

    // Seleccionamos todos los elementos que queramos animar
    const elementosOcultos = document.querySelectorAll('.animar-scroll');
    elementosOcultos.forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // Limpieza al salir
  }, [cargando]);


  return (
    <div id="inicio">
      <Navbar />

      {/* --- HERO SECTION CON CARRUSEL --- */}
      <header className="hero">
        
        {/* Capa de Imágenes */}
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === imagenActual ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.imagenUrl})` }}
            ></div>
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          {slides.length > 0 && (
          <>  
          <h1 style={{color: '#B4942E'}}>{slides[imagenActual].titulo}</h1>
          <p>{slides[imagenActual].subtitulo}</p>
          
          <a href="#catalogo" className="btn-hero" style={{marginTop: '25px', display:'inline-block'}}>
            VER COLECCIÓN
          </a>
          </>
          )}
        </div>
      </header>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar un producto.." 
          className="search-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* --- SECCIÓN CATÁLOGO --- */}
      <section id="catalogo" className="app-container">
        <h2 className="section-title">Nuestra Colección</h2>     
        <div className="catalogo-grid">
          
          {/* CASO A: Todavía está cargando desde el servidor */}
          {cargando && (
             <div style={{width: '100%', textAlign: 'center', gridColumn: '1/-1'}}>
               <p style={{fontSize: '1.2rem', color: '#888'}}>⏳ Cargando brillos...</p>
             </div>
          )}

          {/* CASO B: Ya cargó, pero la búsqueda no encontró nada */}
          {!cargando && joyasFiltradas.length === 0 && (
             <div className="no-resultados">
               <h3>😕 No encontramos esa joya</h3>
               <p>Intenta con otro nombre o explora nuestra colección completa.</p>
               <button onClick={() => setBusqueda('')} className="btn-secondary" style={{marginTop:'10px'}}>
                 Ver todo
               </button>
             </div>
          )}

          {/* CASO C: Todo bien, mostramos las tarjetas */}
          {!cargando && joyasFiltradas.map(joya => (
            <div key={joya.id} className="tarjeta">
              <img src={joya.urlImagen || 'https://via.placeholder.com/300'} alt={joya.nombre} />
              <div className="info-producto">
                <h3>{joya.nombre}</h3>
                <p className="precio">${joya.precio ? joya.precio.toLocaleString('es-MX') : '0.00'}</p>
                <button className="btn-primary" onClick={() => abrirModal(joya)}>VER DETALLES</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN NOSOTROS  --- */}
      <section id="nosotros" className="seccion-clara">
        <div className="app-container animar-scroll" style={{textAlign: 'center'}}>
          <h2 className="section-title">Nuestra Historia</h2>
          <p style={{maxWidth: '800px', margin: '0 auto'}}>
            En <strong>Joyería con Alma</strong>, nos dedicamos a preservar la belleza de las tradiciones yucatecas 
            a través de accesorios únicos.
            Cada pieza, desde nuestros rosarios de filigrana hasta nuestras peinetas decoradas, 
            está seleccionada y creada con amor para resaltar la elegancia de la mujer regional. 
            Nos enorgullece ofrecer productos que no solo adornan, sino que cuentan una historia.
          </p>
          <img className="animar-scroll delay-200"
            src={aboutUsImg} 
            alt="about us" 
            style={{
              width: '300px',       
              height: '300px',      
              borderRadius: '50%',  
              objectFit: 'cover',   
              marginTop: '40px',   
              boxShadow: '0 15px 35px rgba(212, 175, 55, 0.2)',
              border: '3px solid white'
            }}
          />
        </div>
      </section>

      {/* --- SECCIÓN CONTACTO --- */}
      <section id="contacto" className="seccion-oscura" style={{backgroundColor: '#222', color: '#fff'}}>
        <div className="app-container" style={{textAlign: 'center'}}>
          <div className="animar-scroll">
            <h2 className="section-title" style={{color: '#D4AF37', fontFamily: 'Playfair Display, serif'}}>Contáctanos</h2>
            <p style={{marginBottom: '40px', fontSize: '1.1rem'}}>¿Buscas un diseño personalizado o tienes dudas?</p>
          </div>
          
          
          <div className="contact-responsive animar-scroll delay-200">
             
             {/* REDES SOCIALES  */}
             <div>
               <h4 style={{color: '#D4AF37', marginBottom: '15px', fontSize: '1.2rem'}}>Redes Sociales</h4>
            
               <a href="https://www.facebook.com/profile.php?id=100027233036988" target="_blank" rel="noreferrer" style={{
                  display: 'flex',          
                  alignItems: 'center',      
                  justifyContent: 'center',  
                  gap: '10px',              
                  textDecoration: 'none',
                  color: 'white',
                  fontSize: '1rem'
               }}>      
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                    alt="Facebook" 
                    style={{width: '30px', height: '30px'}} 
                  />
                  <span>Joyeria con Alma</span>
               </a>
              

             </div>

             {/*TELÉFONO DE CONTACTO */}
             <div>
               <h4 style={{color: '#D4AF37', marginBottom: '15px', fontSize: '1.2rem'}}>Teléfono</h4>
               <p style={{fontSize: '1rem'}}>+52 9999 69 12 19</p>
             </div>
          </div>

        </div>
      </section>
      
      <footer style={{textAlign: 'center', padding: '20px', fontSize: '0.9rem'}}>
          Joyería con Alma. Siempre presente en tus momentos especiales.
      </footer>

      <WhatsappBtn />
      

      {productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          {/* stopPropagation evita que al dar clic DENTRO de la tarjeta se cierre */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <img 
              src={productoSeleccionado.urlImagen || 'https://via.placeholder.com/300'} 
              alt={productoSeleccionado.nombre} 
              className="modal-img"
            />
            
            <h2 className="modal-titulo">{productoSeleccionado.nombre}</h2>
            <p className="modal-precio">${productoSeleccionado.precio}</p>
            
            <p className="modal-descripcion">
              {productoSeleccionado.descripcion || "Una pieza hermosa para resaltar tu estilo único."}
            </p>
            
            <p className="modal-stock">
              Disponible: {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} piezas` : "Agotado"}
            </p>

            <div className="modal-actions">
              <a 
                href={`https://wa.me/529999691219?text=Buenas tardes! Me interesa el producto "${productoSeleccionado.nombre}" y quisiera más información.`}
                target="_blank"
                rel="noreferrer"
                className="btn-modal-whatsapp"
              >
                 Lo quiero
              </a>

              <button className="btn-modal-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>           
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Catalogo