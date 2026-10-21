import { FaExclamationTriangle } from 'react-icons/fa';
import Modal from './Modal.jsx';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isAlertOnly = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="confirm-modal-body">
        <div className="confirm-modal-icon">
          <FaExclamationTriangle size={28} color={variant === 'danger' ? '#e74c3c' : '#D4AF37'} />
        </div>
        <p className="confirm-modal-message">{message}</p>
      </div>
      <div className="form-actions">
        {!isAlertOnly && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          className={`btn ${variant === 'danger' ? 'btn-danger-solid' : 'btn-primary'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
