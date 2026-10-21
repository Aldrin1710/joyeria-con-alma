import Modal from '../../../components/ui/Modal.jsx';
import HashtagInput from './HashtagInput.jsx';

export default function ProductForm({
  isOpen,
  form,
  editandoId,
  onChange,
  onAddHashtag,
  onRemoveHashtag,
  onFileChange,
  onCancel,
  onSave,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={editandoId ? 'Editar Joya' : 'Agregar Producto'}
      onClose={onCancel}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Nombre de la pieza</label>
          <input
            className="form-input"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Ej. Rosario de Filigrana Tradicional"
          />
        </div>
        <div className="form-group">
          <label>Precio ($ MXN)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            name="precio"
            value={form.precio}
            onChange={onChange}
            placeholder="2500"
          />
        </div>
        <div className="form-group">
          <label>Disponibilidad</label>
          <select
            className="form-input"
            name="estado"
            value={form.estado}
            onChange={onChange}
          >
            <option value="EN_STOCK">EN STOCK</option>
            <option value="BAJO_ENCARGO">BAJO ENCARGO</option>
            <option value="AGOTADO">AGOTADO</option>
            <option value="BORRADOR">BORRADOR</option>
          </select>
        </div>
      </div>

      <HashtagInput
        hashtags={form.hashtags}
        onAddHashtag={onAddHashtag}
        onRemoveHashtag={onRemoveHashtag}
      />

      <div className="form-group full-width">
        <label>Descripción</label>
        <textarea
          className="form-textarea"
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          placeholder="Detalles sobre materiales, origen y diseño..."
        />
      </div>

      <div className="form-group full-width">
        <label>
          Imagen (.jpg, .jpeg, .png - máx 5MB)
          {editandoId ? ' — Opcional si deseas conservar la actual' : ''}
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
        <button type="button" onClick={onSave} className="btn btn-primary">
          {editandoId ? 'Actualizar Joya' : 'Guardar Joya'}
        </button>
      </div>
    </Modal>
  );
}
