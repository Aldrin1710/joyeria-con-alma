import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminService } from '../api/adminService.js';

export function useAdminProducts({ onUnauthorized, requestConfirm, requestAlert } = {}) {
  const [productos, setProductos] = useState([]);
  const [papelera, setPapelera] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getProducts();
      setProductos(data);
    } catch (err) {
      setError('Error cargando productos');
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        onUnauthorized?.();
      }
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  const cargarPapelera = useCallback(async () => {
    try {
      const data = await adminService.getTrashProducts();
      setPapelera(data);
    } catch (err) {
      console.error('Error cargando papelera:', err);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarPapelera();
  }, [cargarProductos, cargarPapelera]);

  const eliminarProducto = (id) => {
    requestConfirm?.({
      title: 'Mover a la papelera',
      message: '¿Mover esta joya a la papelera de reciclaje? Se eliminará automáticamente en 15 días.',
      confirmLabel: 'Mover a papelera',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await adminService.softDeleteProduct(id);
          toast.success('Joya enviada a la papelera');
          cargarProductos();
          cargarPapelera();
        } catch {
          requestAlert?.({ title: 'Error', message: 'No se pudo mover la joya a la papelera.' });
        }
      },
    });
  };

  const restaurarProducto = async (id) => {
    try {
      await adminService.restoreProduct(id);
      toast.success('Joya restaurada al catálogo');
      cargarProductos();
      cargarPapelera();
    } catch {
      requestAlert?.({ title: 'Error', message: 'No se pudo restaurar la joya.' });
    }
  };

  const eliminarPermanente = (id) => {
    requestConfirm?.({
      title: 'Eliminar permanentemente',
      message: '¿Eliminar definitivamente esta joya y sus imágenes? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar definitivo',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await adminService.permanentDeleteProduct(id);
          toast.success('Joya eliminada permanentemente');
          cargarPapelera();
        } catch {
          requestAlert?.({ title: 'Error', message: 'No se pudo eliminar permanentemente la joya.' });
        }
      },
    });
  };

  const vaciarPapelera = () => {
    requestConfirm?.({
      title: 'Vaciar papelera',
      message: '¿Vaciar toda la papelera y purgar todas las imágenes permanentemente? Esta acción es irreversible.',
      confirmLabel: 'Vaciar papelera',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await adminService.emptyTrash();
          toast.success(res?.message || 'Papelera vaciada');
          cargarPapelera();
        } catch {
          requestAlert?.({ title: 'Error', message: 'Error vaciando la papelera.' });
        }
      },
    });
  };

  const manejarCheck = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((i) => i !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const manejarCheckTodos = (e) => {
    setSeleccionados(e.target.checked ? productos.map((p) => p._id || p.id) : []);
  };

  return {
    data: productos,
    productos,
    papelera,
    seleccionados,
    loading,
    error,
    cargarProductos,
    cargarPapelera,
    eliminarProducto,
    restaurarProducto,
    eliminarPermanente,
    vaciarPapelera,
    manejarCheck,
    manejarCheckTodos,
  };
}
