import Modal from '../../../components/ui/Modal.jsx';

export default function SlideForm({
  isOpen,
  formSlide,
  setFormSlide,
  editandoSlideId,
  onFileChange,
  onCancel,
  onSaveSlide,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={editandoSlideId ? 'Editar Banner del Carrusel' : 'Agregar Banner al Carrusel'}
      onClose={onCancel}
    >
      <div className="form-group full-width" style={{ marginTop: 0 }}>
        <label>Título Principal</label>
        <input
          className="form-input"
          placeholder="Ej. Colección Especial Novias"
          value={formSlide.titulo}
          onChange={(e) => setFormSlide({ ...formSlide, titulo: e.target.value })}
        />
      </div>

      <div className="form-group full-width">
        <label>Subtítulo</label>
        <input
          className="form-input"
          placeholder="Ej. Diseños hechos a mano con filigrana"
          value={formSlide.subtitulo}
          onChange={(e) => setFormSlide({ ...formSlide, subtitulo: e.target.value })}
        />
      </div>

      <div className="form-group full-width">
        <label>Enlace de destino (URL)</label>
        <input
          className="form-input"
          placeholder="/catalogo"
          value={formSlide.targetUrl}
          onChange={(e) => setFormSlide({ ...formSlide, targetUrl: e.target.value })}
        />
      </div>

      <div className="form-group full-width">
        <label>
          Imagen del Banner
          {editandoSlideId ? ' (Opcional si deseas conservar la imagen actual)' : ''}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files[0])}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="button" onClick={onSaveSlide} className="btn btn-primary">
          {editandoSlideId ? 'Guardar Cambios' : 'Subir Banner'}
        </button>
      </div>
    </Modal>
  );
}
