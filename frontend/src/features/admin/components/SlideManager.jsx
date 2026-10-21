import { FaImages, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function SlideManager({
  slides,
  onAddClick,
  onEditSlide,
  onDeleteSlide,
}) {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <FaImages className="section-icon" /> Banners del Hero ({slides.length})
        </h2>
        <button type="button" onClick={onAddClick} className="btn btn-primary btn-icon">
          <FaPlus size={13} /> Agregar slide
        </button>
      </div>

      <div className="slides-grid">
        {slides.length === 0 && (
          <div className="empty-state">No hay imágenes registradas en el carrusel.</div>
        )}

        {slides.map((slide) => {
          const id = slide._id || slide.id;
          return (
            <div key={id} className="slide-card">
              <img
                src={slide.imageUrl || slide.imagenUrl}
                alt={slide.titulo || 'Banner'}
                className="slide-img"
              />
              <div className="slide-content">
                <h4>{slide.titulo}</h4>
                <p>{slide.subtitulo}</p>
                <div className="slide-card-actions">
                  <button
                    type="button"
                    onClick={() => onEditSlide(slide)}
                    className="btn btn-edit btn-icon"
                  >
                    <FaEdit size={13} /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSlide(id)}
                    className="btn btn-danger btn-icon"
                  >
                    <FaTrashAlt size={13} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
