import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminService } from '../api/adminService.js';

const INITIAL_FORM = {
  nombre: '',
  precio: '',
  estado: 'EN_STOCK',
  descripcion: '',
  hashtags: [],
};

export function useProductForm({ onSaved, requestAlert } = {}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const manejarCambioInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarHashtag = (tag) => {
    setForm((prev) => ({
      ...prev,
      hashtags: prev.hashtags.includes(tag) ? prev.hashtags : [...prev.hashtags, tag],
    }));
  };

  const eliminarHashtag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tagToRemove),
    }));
  };

  const limpiarFormulario = () => {
    setForm(INITIAL_FORM);
    setArchivoSeleccionado(null);
    setEditandoId(null);
    setError(null);
    setIsModalOpen(false);
  };

  const abrirNuevoProducto = () => {
    setForm(INITIAL_FORM);
    setArchivoSeleccionado(null);
    setEditandoId(null);
    setError(null);
    setIsModalOpen(true);
  };

  const prepararEdicion = (prod) => {
    const parsedTags = Array.isArray(prod.hashtags)
      ? prod.hashtags.filter(Boolean)
      : typeof prod.hashtags === 'string' && prod.hashtags.trim()
      ? prod.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    setForm({
      nombre: prod.nombre || '',
      precio: prod.precioBase ?? prod.precio ?? '',
      estado: prod.estado || 'EN_STOCK',
      descripcion: prod.descripcion || '',
      hashtags: parsedTags,
    });
    setEditandoId(prod._id || prod.id);
    setArchivoSeleccionado(null);
    setError(null);
    setIsModalOpen(true);
  };

  const guardarProducto = async () => {
    if (!form.nombre.trim() || form.precio === '' || Number(form.precio) < 0) {
      requestAlert?.({
        title: 'Datos incompletos',
        message: 'Completa el nombre y un precio válido (mayor o igual a 0) para la joya.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.nombre.trim());
    formData.append('precioBase', form.precio);
    formData.append('estado', form.estado);
    formData.append('descripcion', form.descripcion || 'Pieza exclusiva de joyería artesanal.');
    if (form.hashtags.length > 0) {
      formData.append('hashtags', form.hashtags.join(', '));
    }
    if (archivoSeleccionado) {
      formData.append('imagenes', archivoSeleccionado);
    }

    try {
      setLoading(true);
      setError(null);
      if (editandoId) {
        await adminService.updateProduct(editandoId, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await adminService.createProduct(formData);
        toast.success('Producto guardado correctamente');
      }

      limpiarFormulario();
      onSaved?.();
    } catch (err) {
      setError('Error al guardar el producto');
      toast.error('Error al guardar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data: form,
    form,
    archivoSeleccionado,
    setArchivoSeleccionado,
    editandoId,
    isModalOpen,
    loading,
    error,
    manejarCambioInput,
    agregarHashtag,
    eliminarHashtag,
    abrirNuevoProducto,
    prepararEdicion,
    limpiarFormulario,
    guardarProducto,
  };
}
