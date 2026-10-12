import { FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  return (
    <footer className="footer">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.9rem', marginBottom: '0.5rem' }}>
          Joyería con Alma
        </h2>
        <p style={{ maxWidth: '600px', margin: '0.5rem auto 1.5rem auto', color: '#b5b5b5', textAlign: 'center', lineHeight: '1.6' }}>
          Preservamos la belleza de las tradiciones yucatecas a través de accesorios únicos. 
          Piezas elaboradas a mano con pasión y elegancia.
        </p>
        <div className="footer-social">
          <a href="https://www.facebook.com/profile.php?id=100027233036988" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100027233036988" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
        <div style={{ borderTop: '1px solid #2d2d2d', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#888888', textAlign: 'center', margin: '0 auto' }}>
            &copy; {new Date().getFullYear()} Joyería con Alma. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
