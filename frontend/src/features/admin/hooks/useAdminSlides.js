import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminService } from '../api/adminService.js';

const INITIAL_SLIDE_FORM = {
  titulo: '',
  subtitulo: '',
  targetUrl: '',
};

export function useAdminSlides({ requestConfirm, requestAlert } = {}) {
  const [slides, setSlides] = useState([]);
  const [formSlide, setFormSlide] = useState(INITIAL_SLIDE_FORM);
  const [archivoSlide, setArchivoSlide] = useState(null);
  const [editandoSlideId, setEditandoSlideId] = useState(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSlides();
      setSlides(data);
    } catch (err) {
      setError('Error cargando slides');
      console.error('Error cargando slides:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSlides();
  }, [cargarSlides]);

  const limpiarFormularioSlide = () => {
    setFormSlide(INITIAL_SLIDE_FORM);
    setArchivoSlide(null);
    setEditandoSlideId(null);
    setIsSlideModalOpen(false);
  };

  const abrirNuevoSlide = () => {
    setFormSlide(INITIAL_SLIDE_FORM);
    setArchivoSlide(null);
    setEditandoSlideId(null);
    setIsSlideModalOpen(true);
  };

  const prepararEdicionSlide = (slide) => {
    setFormSlide({
      titulo: slide.titulo || '',
      subtitulo: slide.subtitulo || '',
      targetUrl: slide.targetUrl || '/catalogo',
    });
    setArchivoSlide(null);
    setEditandoSlideId(slide._id || slide.id);
    setIsSlideModalOpen(true);
  };

  const guardarSlide = async () => {
    if (!formSlide.titulo.trim() || (!editandoSlideId && !archivoSlide)) {
      requestAlert?.({
        title: 'Datos incompletos',
        message: editandoSlideId
          ? 'El banner debe tener un título principal.'
          : 'Agrega un título y selecciona una imagen para el nuevo banner.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', formSlide.titulo.trim());
    formData.append('subtitulo', formSlide.subtitulo || '');
    formData.append('targetUrl', formSlide.targetUrl || '/catalogo');
    if (archivoSlide) {
      formData.append('imagen', archivoSlide);
    }

    try {
      if (editandoSlideId) {
        await adminService.updateSlide(editandoSlideId, formData);
        toast.success('Banner actualizado correctamente');
      } else {
        await adminService.createSlide(formData);
        toast.success('Banner agregado al carrusel');
      }
      limpiarFormularioSlide();
      cargarSlides();
    } catch {
      toast.error('Error al guardar el banner');
    }
  };

  const eliminarSlide = (id) => {
    requestConfirm?.({
      title: 'Eliminar banner',
      message: '¿Eliminar este banner publicitario del carrusel principal?',
      confirmLabel: 'Eliminar banner',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteSlide(id);
          cargarSlides();
          toast.success('Banner eliminado');
        } catch {
          requestAlert?.({ title: 'Error', message: 'No se pudo eliminar el banner.' });
        }
      },
    });
  };

  return {
    data: slides,
    slides,
    formSlide,
    setFormSlide,
    archivoSlide,
    setArchivoSlide,
    editandoSlideId,
    isSlideModalOpen,
    loading,
    error,
    cargarSlides,
    abrirNuevoSlide,
    prepararEdicionSlide,
    limpiarFormularioSlide,
    guardarSlide,
    eliminarSlide,
  };
}
