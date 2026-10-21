import { useState, useCallback } from 'react';

const INITIAL_DIALOG = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  variant: 'danger',
  isAlertOnly: false,
  onConfirmAction: null,
};

export function useConfirmDialog() {
  const [dialog, setDialog] = useState(INITIAL_DIALOG);

  const closeDialog = useCallback(() => {
    setDialog(INITIAL_DIALOG);
  }, []);

  const requestConfirm = useCallback(({
    title = 'Confirmar acción',
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger',
    onConfirm,
  }) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      variant,
      isAlertOnly: false,
      onConfirmAction: onConfirm,
    });
  }, []);

  const requestAlert = useCallback(({
    title = 'Atención',
    message,
    confirmLabel = 'Entendido',
    variant = 'warning',
  }) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel: '',
      variant,
      isAlertOnly: true,
      onConfirmAction: null,
    });
  }, []);

  const handleConfirm = async () => {
    const action = dialog.onConfirmAction;
    closeDialog();
    if (action) {
      await action();
    }
  };

  return {
    dialogProps: {
      isOpen: dialog.isOpen,
      title: dialog.title,
      message: dialog.message,
      confirmLabel: dialog.confirmLabel,
      cancelLabel: dialog.cancelLabel,
      variant: dialog.variant,
      isAlertOnly: dialog.isAlertOnly,
      onConfirm: handleConfirm,
      onCancel: closeDialog,
    },
    requestConfirm,
    requestAlert,
    closeDialog,
  };
}
