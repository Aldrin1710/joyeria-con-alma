import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/admin.css';
import { Toaster, toast } from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();

  // Estados de Navegación
  const [pestanaActiva, setPestanaActiva] = useState('productos');

  // Estados Productos
  const [productos, setProductos] = useState([]);
  const [papelera, setPapelera] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    estado: 'EN_STOCK',
    descripcion: '',
    hashtags: '',
  });
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  // Estados Carrusel
  const [slides, setSlides] = useState([]);
  const [formSlide, setFormSlide] = useState({ titulo: '', subtitulo: '', targetUrl: '' });
  const [archivoSlide, setArchivoSlide] = useState(null);

  // Configuración de API con Cookies HttpOnly
  const BASE = import.meta.env.VITE_API_URL || '/api';
  const URL_ADMIN_PROD = `${BASE}/admin/productos`;
  const URL_ADMIN_SLIDES = `${BASE}/admin/slides`;
  const URL_ADMIN_PAPELERA = `${BASE}/admin/papelera`;
  const URL_AUTH_LOGOUT = `${BASE}/auth/logout`;

  const authConfig = { withCredentials: true };

  useEffect(() => {
    const esAdmin = sessionStorage.getItem('esAdmin');
    if (!esAdmin) {
      navigate('/login-joyeria');
      return;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (tokenError) => {
        if (tokenError.response && (tokenError.response.status === 401 || tokenError.response.status === 403)) {
          console.warn('Sesión expirada o token inválido');
          sessionStorage.clear();
          navigate('/login-joyeria');
        }
        return Promise.reject(tokenError);
      }
    );

    cargarProductos();
    cargarSlides();
    cargarPapelera();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // --- LÓGICA PRODUCTOS ---
  const cargarProductos = async () => {
    try {
      const res = await axios.get(URL_ADMIN_PROD, authConfig);
      setProductos(res.data?.data || res.data || []);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) cerrarSesion();
    }
  };

  const cargarPapelera = async () => {
    try {
      const res = await axios.get(`${URL_ADMIN_PROD}?isTrash=true`, authConfig);
      setPapelera(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error cargando papelera:', err);
    }
  };

  const manejarCambioInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarProducto = async () => {
    if (!form.nombre || !form.precio) {
      alert('Completa el nombre y el precio de la joya');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('precioBase', form.precio);
    formData.append('estado', form.estado);
    formData.append('descripcion', form.descripcion || 'Pieza exclusiva de joyería artesanal.');
    if (form.hashtags) formData.append('hashtags', form.hashtags);
    if (archivoSeleccionado) formData.append('imagenes', archivoSeleccionado);

    try {
      if (editandoId) {
        await axios.put(`${URL_ADMIN_PROD}/${editandoId}`, formData, authConfig);
        toast.success('Producto actualizado correctamente');
      } else {
        await axios.post(URL_ADMIN_PROD, formData, authConfig);
        toast.success('Producto guardado correctamente');
      }

      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      toast.error('Error al guardar el producto');
      console.error(err);
    }
  };

  // Mover a la papelera (Soft delete)
  const eliminarProducto = async (id) => {
    if (window.confirm('¿Mover esta joya a la papelera de reciclaje? (Se eliminará automáticamente en 15 días)')) {
      try {
        await axios.delete(`${URL_ADMIN_PROD}/${id}`, authConfig);
        toast.success('Joya enviada a la papelera');
        cargarProductos();
        cargarPapelera();
      } catch (err) {
        alert('Error al mover a la papelera');
      }
    }
  };

  // Restaurar de la papelera
  const restaurarProducto = async (id) => {
    try {
      await axios.patch(`${URL_ADMIN_PROD}/${id}/restore`, {}, authConfig);
      toast.success('Joya restaurada al catálogo');
      cargarProductos();
      cargarPapelera();
    } catch (err) {
      alert('Error al restaurar joya');
    }
  };

  // Eliminar permanentemente
  const eliminarPermanente = async (id) => {
    if (window.confirm('¿Eliminar definitivamente esta joya y sus fotos de Cloudinary?')) {
      try {
        await axios.delete(`${URL_ADMIN_PROD}/${id}/permanent`, authConfig);
        toast.success('Joya eliminada permanentemente');
        cargarPapelera();
      } catch (err) {
        alert('Error al eliminar permanentemente');
      }
    }
  };

  // Vaciar papelera
  const vaciarPapelera = async () => {
    if (window.confirm('¿Vaciar toda la papelera y purgar todas las fotos de Cloudinary? Esta acción es irreversible.')) {
      try {
        const res = await axios.delete(URL_ADMIN_PAPELERA, authConfig);
        toast.success(res.data?.message || 'Papelera vaciada');
        cargarPapelera();
      } catch (err) {
        alert('Error vaciando la papelera');
      }
    }
  };

  const prepararEdicion = (prod) => {
    setForm({
      nombre: prod.nombre,
      precio: prod.precioBase || prod.precio || '',
      estado: prod.estado || 'EN_STOCK',
      descripcion: prod.descripcion || '',
      hashtags: prod.hashtags ? prod.hashtags.join(', ') : '',
    });
    setEditandoId(prod._id || prod.id);
    setPestanaActiva('productos');
    setArchivoSeleccionado(null);
    window.scrollTo(0, 0);
  };

  const limpiarFormulario = () => {
    setForm({ nombre: '', precio: '', estado: 'EN_STOCK', descripcion: '', hashtags: '' });
    setArchivoSeleccionado(null);
    setEditandoId(null);
  };

  const manejarCheck = (id) => {
    if (seleccionados.includes(id)) setSeleccionados(seleccionados.filter((i) => i !== id));
    else setSeleccionados([...seleccionados, id]);
  };

  const manejarCheckTodos = (e) => {
    setSeleccionados(e.target.checked ? productos.map((p) => p._id || p.id) : []);
  };

  // --- LÓGICA CARRUSEL ---
  const cargarSlides = async () => {
    try {
      const res = await axios.get(URL_ADMIN_SLIDES, authConfig);
      setSlides(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error cargando slides:', err);
    }
  };

  const guardarSlide = async () => {
    if (!formSlide.titulo || !archivoSlide) {
      alert('Agrega un título y selecciona una imagen para el banner');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', formSlide.titulo);
    formData.append('subtitulo', formSlide.subtitulo);
    formData.append('targetUrl', formSlide.targetUrl || '/catalogo');
    formData.append('imagen', archivoSlide);

    try {
      await axios.post(URL_ADMIN_SLIDES, formData, authConfig);
      setFormSlide({ titulo: '', subtitulo: '', targetUrl: '' });
      setArchivoSlide(null);
      cargarSlides();
      toast.success('Slide guardado en el carrusel');
    } catch (err) {
      toast.error('Error al subir el slide');
    }
  };

  const eliminarSlide = async (id) => {
    if (window.confirm('¿Eliminar este banner publicitario?')) {
      try {
        await axios.delete(`${URL_ADMIN_SLIDES}/${id}`, authConfig);
        cargarSlides();
        toast.success('Slide eliminado');
      } catch (err) {
        alert('Error al eliminar slide');
      }
    }
  };

  const cerrarSesion = async () => {
    try {
      await axios.post(URL_AUTH_LOGOUT, {}, authConfig);
    } catch (e) {
      // Ignorar fallo de red en logout
    }
    sessionStorage.clear();
    navigate('/login-joyeria');
  };

  return (
    <div className="admin-container">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="admin-top-bar">
        <h1 className="admin-header">Panel de Administración</h1>
        <div className="admin-actions">
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Ver Tienda
          </button>
          <button onClick={cerrarSesion} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* NAVEGACIÓN PESTAÑAS */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${pestanaActiva === 'productos' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('productos')}
        >
          💎 Catálogo de Joyas ({productos.length})
        </button>
        <button
          className={`tab-btn ${pestanaActiva === 'papelera' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('papelera')}
        >
          🗑️ Papelera ({papelera.length})
        </button>
        <button
          className={`tab-btn ${pestanaActiva === 'slides' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('slides')}
        >
          🖼️ Banners del Hero ({slides.length})
        </button>
      </div>

      {/* --- PANEL PRODUCTOS --- */}
      {pestanaActiva === 'productos' && (
        <>
          <div className="admin-card">
            <h3>{editandoId ? 'Editar Joya' : 'Nueva Joya'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre de la pieza</label>
                <input
                  className="form-input"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambioInput}
                  placeholder="Ej. Rosario de Filigrana Tradicional"
                />
              </div>
              <div className="form-group">
                <label>Precio ($ MXN)</label>
                <input
                  className="form-input"
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={manejarCambioInput}
                  placeholder="2500"
                />
              </div>
              <div className="form-group">
                <label>Disponibilidad</label>
                <select
                  className="form-input"
                  name="estado"
                  value={form.estado}
                  onChange={manejarCambioInput}
                >
                  <option value="EN_STOCK">EN STOCK</option>
                  <option value="BAJO_ENCARGO">BAJO ENCARGO</option>
                  <option value="AGOTADO">AGOTADO</option>
                  <option value="BORRADOR">BORRADOR</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Hashtags (separados por coma)</label>
              <input
                className="form-input"
                name="hashtags"
                value={form.hashtags}
                onChange={manejarCambioInput}
                placeholder="#Filigrana, #Boda, #Tradición"
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                className="form-textarea"
                name="descripcion"
                value={form.descripcion}
                onChange={manejarCambioInput}
                placeholder="Detalles sobre materiales, origen y diseño..."
              />
            </div>

            <div className="form-group full-width">
              <label>Imagen (.jpg, .jpeg, .png - máx 5MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
              />
            </div>

            <div className="form-actions">
              {editandoId && (
                <button onClick={limpiarFormulario} className="btn btn-secondary">
                  Cancelar
                </button>
              )}
              <button onClick={guardarProducto} className="btn btn-primary">
                {editandoId ? 'Actualizar Joya' : 'Guardar Joya'}
              </button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    onChange={manejarCheckTodos}
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
              {productos.map((prod) => {
                const id = prod._id || prod.id;
                return (
                  <tr key={id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(id)}
                        onChange={() => manejarCheck(id)}
                      />
                    </td>
                    <td>
                      <strong>{prod.nombre}</strong>
                    </td>
                    <td>${prod.precioBase || prod.precio || 0}</td>
                    <td>
                      <span className="badge">{prod.estado || 'EN_STOCK'}</span>
                    </td>
                    <td className="col-actions">
                      <div className="actions-group">
                        <button onClick={() => prepararEdicion(prod)} className="btn btn-edit">
                          Editar
                        </button>
                        <button onClick={() => eliminarProducto(id)} className="btn btn-danger">
                          Mover a Papelera
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {/* --- PANEL PAPELERA DE RECICLAJE (RF10) --- */}
      {pestanaActiva === 'papelera' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#666', margin: 0 }}>
              Las piezas en esta sección se purgan automáticamente tras <strong>15 días</strong>.
            </p>
            {papelera.length > 0 && (
              <button onClick={vaciarPapelera} className="btn btn-danger">
                🗑️ Vaciar Papelera Permanentemente
              </button>
            )}
          </div>

          {papelera.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>La papelera está vacía ✨</h3>
              <p style={{ color: '#888' }}>No hay piezas pendientes de eliminación.</p>
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
                      <td>${prod.precioBase || prod.precio || 0}</td>
                      <td>{prod.deletedAt ? new Date(prod.deletedAt).toLocaleDateString() : 'Reciente'}</td>
                      <td className="col-actions">
                        <div className="actions-group">
                          <button onClick={() => restaurarProducto(id)} className="btn btn-primary" style={{ backgroundColor: '#28a745' }}>
                            Restaurar
                          </button>
                          <button onClick={() => eliminarPermanente(id)} className="btn btn-danger">
                            Eliminar Definitivo
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* --- PANEL CARRUSEL --- */}
      {pestanaActiva === 'slides' && (
        <>
          <div className="admin-card">
            <h3>Agregar Banner al Carrusel</h3>

            <div className="form-group full-width">
              <label>Título Principal</label>
              <input
                className="form-input"
                placeholder="Ej. Colección Especial Novias"
                value={formSlide.titulo}
                onChange={(e) => setFormSlide({ ...formSlide, titulo: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Subtítulo</label>
              <input
                className="form-input"
                placeholder="Ej. Diseños hechos a mano con filigrana"
                value={formSlide.subtitulo}
                onChange={(e) => setFormSlide({ ...formSlide, subtitulo: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Imagen del Banner</label>
              <input type="file" accept="image/*" onChange={(e) => setArchivoSlide(e.target.files[0])} />
            </div>

            <div className="form-actions">
              <button onClick={guardarSlide} className="btn btn-primary">
                Subir Banner
              </button>
            </div>
          </div>

          <div className="slides-grid">
            {slides.length === 0 && <div className="empty-state">No hay imágenes en el carrusel.</div>}

            {slides.map((slide) => {
              const id = slide._id || slide.id;
              return (
                <div key={id} className="slide-card">
                  <img src={slide.imageUrl || slide.imagenUrl} alt="slide" className="slide-img" />
                  <div className="slide-content">
                    <h4>{slide.titulo}</h4>
                    <p>{slide.subtitulo}</p>
                    <button onClick={() => eliminarSlide(id)} className="btn btn-danger" style={{ width: '100%' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}