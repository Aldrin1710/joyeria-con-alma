import { FaGem, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';

export default function ProductTable({
  productos,
  seleccionados,
  onToggleSelect,
  onToggleSelectAll,
  onAddClick,
  onEdit,
  onDelete,
}) {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <FaGem className="section-icon" /> Catálogo de Joyas ({productos.length})
        </h2>
        <button type="button" onClick={onAddClick} className="btn btn-primary btn-icon">
          <FaPlus size={13} /> Agregar producto
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input
                type="checkbox"
                onChange={onToggleSelectAll}
                checked={productos.length > 0 && seleccionados.length === productos.length}
              />
            </th>
            <th>Pieza</th>
            <th>Precio</th>
            <th>Estado</th>
            <th className="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                No hay productos registrados en el catálogo.
              </td>
            </tr>
          ) : (
            productos.map((prod) => {
              const id = prod._id || prod.id;
              return (
                <tr key={id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(id)}
                      onChange={() => onToggleSelect(id)}
                    />
                  </td>
                  <td>
                    <strong>{prod.nombre}</strong>
                  </td>
                  <td>{formatPrice(prod.precioBase || prod.precio || 0)}</td>
                  <td>
                    <span className="badge">{prod.estado || 'EN_STOCK'}</span>
                  </td>
                  <td className="col-actions">
                    <div className="actions-group">
                      <button
                        type="button"
                        onClick={() => onEdit(prod)}
                        className="btn btn-edit btn-icon"
                      >
                        <FaEdit size={13} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        className="btn btn-danger btn-icon"
                      >
                        <FaTrashAlt size={13} /> Mover a Papelera
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
