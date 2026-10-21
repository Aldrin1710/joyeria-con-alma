import { FaTrashAlt, FaArrowLeft, FaStore, FaSignOutAlt } from 'react-icons/fa';

export default function AdminHeader({
  vistaActiva,
  setVistaActiva,
  papeleraCount,
  onViewStore,
  onLogout,
}) {
  const isTrashView = vistaActiva === 'papelera';

  return (
    <div className="admin-top-bar">
      <h1 className="admin-header">Panel de Administración</h1>
      <div className="admin-actions">
        <button
          type="button"
          onClick={() => setVistaActiva(isTrashView ? 'principal' : 'papelera')}
          className={`btn ${isTrashView ? 'btn-primary' : 'btn-secondary'} btn-icon`}
        >
          {isTrashView ? (
            <>
              <FaArrowLeft size={13} /> Volver al Panel
            </>
          ) : (
            <>
              <FaTrashAlt size={13} /> Papelera ({papeleraCount})
            </>
          )}
        </button>
        <button type="button" onClick={onViewStore} className="btn btn-secondary btn-icon">
          <FaStore size={14} /> Ver Tienda
        </button>
        <button type="button" onClick={onLogout} className="btn btn-danger btn-icon">
          <FaSignOutAlt size={14} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
