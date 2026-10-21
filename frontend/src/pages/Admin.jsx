import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { useConfirmDialog } from '../hooks/useConfirmDialog.js';
import { useAdminProducts } from '../features/admin/hooks/useAdminProducts.js';
import { useProductForm } from '../features/admin/hooks/useProductForm.js';
import { useAdminSlides } from '../features/admin/hooks/useAdminSlides.js';
import AdminHeader from '../features/admin/components/AdminHeader.jsx';
import ProductForm from '../features/admin/components/ProductForm.jsx';
import ProductTable from '../features/admin/components/ProductTable.jsx';
import TrashTable from '../features/admin/components/TrashTable.jsx';
import SlideManager from '../features/admin/components/SlideManager.jsx';
import SlideForm from '../features/admin/components/SlideForm.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import './styles/admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [vistaActiva, setVistaActiva] = useState('principal');
  const { logout } = useAuth();
  const { dialogProps, requestConfirm, requestAlert } = useConfirmDialog();

  const cerrarSesion = useCallback(async () => {
    await logout();
    navigate('/login-joyeria');
  }, [logout, navigate]);

  const {
    productos,
    papelera,
    seleccionados,
    cargarProductos,
    eliminarProducto,
    restaurarProducto,
    eliminarPermanente,
    vaciarPapelera,
    manejarCheck,
    manejarCheckTodos,
  } = useAdminProducts({
    onUnauthorized: cerrarSesion,
    requestConfirm,
    requestAlert,
  });

  const {
    form,
    setArchivoSeleccionado,
    editandoId,
    isModalOpen,
    manejarCambioInput,
    agregarHashtag,
    eliminarHashtag,
    abrirNuevoProducto,
    prepararEdicion,
    limpiarFormulario,
    guardarProducto,
  } = useProductForm({
    onSaved: cargarProductos,
    requestAlert,
  });

  const {
    slides,
    formSlide,
    setFormSlide,
    setArchivoSlide,
    editandoSlideId,
    isSlideModalOpen,
    abrirNuevoSlide,
    prepararEdicionSlide,
    limpiarFormularioSlide,
    guardarSlide,
    eliminarSlide,
  } = useAdminSlides({
    requestConfirm,
    requestAlert,
  });

  return (
    <div className="admin-container">
      <Toaster position="top-right" />

      <AdminHeader
        vistaActiva={vistaActiva}
        setVistaActiva={setVistaActiva}
        papeleraCount={papelera.length}
        onViewStore={() => navigate('/')}
        onLogout={cerrarSesion}
      />

      {vistaActiva === 'principal' ? (
        <>
          <ProductTable
            productos={productos}
            seleccionados={seleccionados}
            onToggleSelect={manejarCheck}
            onToggleSelectAll={manejarCheckTodos}
            onAddClick={abrirNuevoProducto}
            onEdit={prepararEdicion}
            onDelete={eliminarProducto}
          />

          <SlideManager
            slides={slides}
            onAddClick={abrirNuevoSlide}
            onEditSlide={prepararEdicionSlide}
            onDeleteSlide={eliminarSlide}
          />
        </>
      ) : (
        <TrashTable
          papelera={papelera}
          onEmptyTrash={vaciarPapelera}
          onRestore={restaurarProducto}
          onPermanentDelete={eliminarPermanente}
        />
      )}

      <ProductForm
        isOpen={isModalOpen}
        form={form}
        editandoId={editandoId}
        onChange={manejarCambioInput}
        onAddHashtag={agregarHashtag}
        onRemoveHashtag={eliminarHashtag}
        onFileChange={setArchivoSeleccionado}
        onCancel={limpiarFormulario}
        onSave={guardarProducto}
      />

      <SlideForm
        isOpen={isSlideModalOpen}
        formSlide={formSlide}
        setFormSlide={setFormSlide}
        editandoSlideId={editandoSlideId}
        onFileChange={setArchivoSlide}
        onCancel={limpiarFormularioSlide}
        onSaveSlide={guardarSlide}
      />

      <ConfirmModal {...dialogProps} />
    </div>
  );
}
