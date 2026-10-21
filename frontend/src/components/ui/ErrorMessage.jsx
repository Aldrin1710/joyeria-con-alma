import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function ErrorMessage({
  title = 'Joya no encontrada',
  message = 'La pieza que buscas podría estar agotada o no encontrarse disponible en este momento.',
  backTo = '/catalogo',
  backLabel = 'Volver al catálogo',
}) {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
      {backTo && (
        <Link to={backTo} className="btn-primary">
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> {backLabel}
        </Link>
      )}
    </div>
  );
}
