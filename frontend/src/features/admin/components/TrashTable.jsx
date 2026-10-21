import { FaTrashAlt, FaUndo, FaCheckCircle } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function TrashTable({
  papelera,
  onEmptyTrash,
  onRestore,
  onPermanentDelete,
}) {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">
            <FaTrashAlt className="section-icon" /> Papelera de Reciclaje ({papelera.length})
          </h2>
          <p style={{ color: '#666', margin: '6px 0 0 0', fontSize: '0.92rem' }}>
            Las piezas en esta sección se purgan automáticamente tras <strong>15 días</strong>.
          </p>
        </div>
        {papelera.length > 0 && (
          <button type="button" onClick={onEmptyTrash} className="btn btn-danger btn-icon">
            <FaTrashAlt size={13} /> Vaciar Papelera Permanentemente
          </button>
        )}
      </div>

      {papelera.length === 0 ? (
        <div className="admin-card admin-empty-card">
          <FaCheckCircle size={32} color="var(--dorado, #D4AF37)" />
          <h3>La papelera está vacía</h3>
          <p>No hay piezas pendientes de eliminación.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pieza</th>
              <th>Precio</th>
              <th>Fecha de Envío a Papelera</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {papelera.map((prod) => {
              const id = prod._id || prod.id;
              return (
                <tr key={id}>
                  <td>
                    <strong>{prod.nombre}</strong>
                  </td>
                  <td>{formatPrice(prod.precioBase || prod.precio || 0)}</td>
                  <td>{formatDate(prod.deletedAt)}</td>
                  <td className="col-actions">
                    <div className="actions-group">
                      <button
                        type="button"
                        onClick={() => onRestore(id)}
                        className="btn btn-primary btn-icon"
                        style={{ backgroundColor: '#28a745' }}
                      >
                        <FaUndo size={12} /> Restaurar
                      </button>
                      <button
                        type="button"
                        onClick={() => onPermanentDelete(id)}
                        className="btn btn-danger btn-icon"
                      >
                        <FaTrashAlt size={12} /> Eliminar Definitivo
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
