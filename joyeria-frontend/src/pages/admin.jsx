import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './styles/admin.css' 

function Admin() {
  const navigate = useNavigate()
  
  // Estados de Navegación
  const [pestanaActiva, setPestanaActiva] = useState('productos')

  // Estados Productos
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', descripcion: '' }) 
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [editandoId, setEditandoId] = useState(null) 
  const [seleccionados, setSeleccionados] = useState([]) 
  
  // Estados Carrusel
  const [slides, setSlides] = useState([])
  const [formSlide, setFormSlide] = useState({ titulo: '', subtitulo: '' })
  const [archivoSlide, setArchivoSlide] = useState(null)

  // Configuración
  const URL_API_PROD = `${import.meta.env.VITE_API_URL}/api/productos`
  const URL_API_SLIDES = `${import.meta.env.VITE_API_URL}/api/slides`
  
  const token = sessionStorage.getItem('jwt_token')
  const authConfig = { headers: { 'Authorization': `Bearer ${token}` } }

  useEffect(() => {
    const esAdmin = sessionStorage.getItem('esAdmin')
    if (!esAdmin || !token) { navigate('/login-joyeria'); 
      return }
      
    const interceptor = axios.interceptors.response.use( 
      response => response, 
      tokenError => {
        if (tokenError.response && (tokenError.response.status === 401 || tokenError.response.status === 403)){
          console.warn("Sesión expirada o token inválido");

          sessionStorage.clear();

          navigate("/login-joyeria");
        } 
          return Promise.reject(tokenError);
      }
    );

    cargarProductos()
    cargarSlides() 

    return () => {
      axios.interceptors.response.eject(interceptor);
    }
  }, [])

  // --- LÓGICA PRODUCTOS ---
  const cargarProductos = async () => {
    try {
      const res = await axios.get(URL_API_PROD, authConfig)
      setProductos(res.data)
    } catch (err) {
      if(err.response && err.response.status === 403) cerrarSesion()
    }
  }

  const manejarCambioInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardarProducto = async () => {
    if (!form.nombre || !form.precio || !form.stock) {
      alert("Completa los campos obligatorios")
      return
    }
    const formData = new FormData()
    formData.append('nombre', form.nombre)
    formData.append('precio', form.precio)
    formData.append('stock', form.stock)
    formData.append('descripcion', form.descripcion)
    if (archivoSeleccionado) formData.append('imagen', archivoSeleccionado)

    try {
      if (editandoId) await axios.put(`${URL_API_PROD}/${editandoId}`, formData, authConfig)
      else await axios.post(URL_API_PROD, formData, authConfig)
      
      limpiarFormulario()
      cargarProductos()
    } catch (err) {
      alert("Error al guardar el producto.")
    }
  }

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar este producto permanentemente?")) {
      try {
        await axios.delete(`${URL_API_PROD}/${id}`, authConfig)
        cargarProductos()
      } catch (err) { alert("Error al eliminar") }
    }
  }

  const eliminarProductosMasivo = async () => {
    if (window.confirm(`¿Eliminar ${seleccionados.length} productos seleccionados?`)) {
      try {
        await Promise.all(seleccionados.map(id => axios.delete(`${URL_API_PROD}/${id}`, authConfig)))
        setSeleccionados([])
        cargarProductos()
      } catch (err) { alert("Error en borrado masivo") }
    }
  }

  const prepararEdicion = (prod) => {
    setForm({ ...prod, descripcion: prod.descripcion || '' }) 
    setEditandoId(prod.id)
    setPestanaActiva('productos')
    setArchivoSeleccionado(null)
    window.scrollTo(0, 0)
  }

  const limpiarFormulario = () => {
    setForm({ nombre: '', precio: '', stock: '', descripcion: '' }) 
    setArchivoSeleccionado(null)
    setEditandoId(null)
  }

  const manejarCheck = (id) => {
    if (seleccionados.includes(id)) setSeleccionados(seleccionados.filter(i => i !== id))
    else setSeleccionados([...seleccionados, id])
  }

  const manejarCheckTodos = (e) => {
    setSeleccionados(e.target.checked ? productos.map(p => p.id) : [])
  }

  // --- LÓGICA CARRUSEL ---
  const cargarSlides = async () => {
    try {
      const res = await axios.get(URL_API_SLIDES)
      setSlides(res.data)
    } catch (err) { console.error(err) }
  }

  const guardarSlide = async () => {
    if (!formSlide.titulo || !archivoSlide) {
      alert("Título e imagen son obligatorios")
      return
    }
    const formData = new FormData()
    formData.append('titulo', formSlide.titulo)
    formData.append('subtitulo', formSlide.subtitulo)
    formData.append('imagen', archivoSlide)

    try {
      await axios.post(URL_API_SLIDES, formData, authConfig)
      setFormSlide({ titulo: '', subtitulo: '' })
      setArchivoSlide(null)
      cargarSlides()
    } catch (err) { alert("Error al subir slide") }
  }

  const eliminarSlide = async (id) => {
    if (window.confirm("¿Eliminar esta imagen del inicio?")) {
      try {
        await axios.delete(`${URL_API_SLIDES}/${id}`, authConfig)
        cargarSlides()
      } catch (err) { alert("Error al eliminar slide") }
    }
  }

  const cerrarSesion = () => {
    sessionStorage.removeItem('esAdmin')
    sessionStorage.removeItem('jwt_token')
    navigate('/')
  }

  return (
    <div className="admin-container">
      
      {/* HEADER */}
      <div className="admin-top-bar">
        <h1 className="admin-header">Administración</h1>
        <div className="admin-actions">
          <button onClick={() => navigate('/')} className="btn btn-secondary">Volver a inicio</button>
          <button onClick={cerrarSesion} className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${pestanaActiva === 'productos' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('productos')}
        >
           Productos
        </button>
        <button 
          className={`tab-btn ${pestanaActiva === 'slides' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('slides')}
        >
           Carrusel
        </button>
      </div>

      {/* --- PANEL PRODUCTOS --- */}
      {pestanaActiva === 'productos' && (
        <>
          <div className="admin-card">
            <h3>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  className="form-input"
                  name="nombre" 
                  value={form.nombre} 
                  onChange={manejarCambioInput} 
                  placeholder="Nombre del producto" 
                />
              </div>
              <div className="form-group">
                <label>Precio ($)</label>
                <input 
                  className="form-input"
                  type="number" 
                  name="precio" 
                  value={form.precio} 
                  onChange={manejarCambioInput} 
                  placeholder="0.00" 
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input 
                  className="form-input"
                  type="number" 
                  name="stock" 
                  value={form.stock} 
                  onChange={manejarCambioInput} 
                  placeholder="0" 
                />
              </div>
            </div>

            <div className="form-group full-width">
                <label>Descripción</label>
                <textarea 
                  className="form-textarea"
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={manejarCambioInput} 
                  placeholder="Detalles del producto..." 
                />
            </div>

            <div className="form-group full-width">
                <label>Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => setArchivoSeleccionado(e.target.files[0])} />           
            </div>

            <div className="form-actions">
              {editandoId && <button onClick={limpiarFormulario} className="btn btn-secondary">Cancelar</button>}
              <button onClick={guardarProducto} className="btn btn-primary">
                {editandoId ? 'Actualizar Producto' : 'Guardar Producto'} 
              </button>
            </div>
          </div>

          {seleccionados.length > 0 && (
            <button onClick={eliminarProductosMasivo} className="btn btn-danger-block">
              Eliminar ({seleccionados.length}) seleccionados
            </button>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>
                  <input 
                    type="checkbox" 
                    onChange={manejarCheckTodos} 
                    checked={productos.length > 0 && seleccionados.length === productos.length} 
                  />
                </th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(prod.id)} 
                      onChange={() => manejarCheck(prod.id)} 
                    />
                  </td>
                  <td>{prod.nombre}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.stock}</td>
                  <td className="col-actions">
                    <div className="actions-group">
                      <button onClick={() => prepararEdicion(prod)} className="btn btn-edit">Editar</button>
                      <button onClick={() => eliminarProducto(prod.id)} className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* --- PANEL CARRUSEL --- */}
      {pestanaActiva === 'slides' && (
        <>
          <div className="admin-card">
            <h3>Agregar al Carrusel</h3>
            
            <div className="form-group full-width">
                <label>Título Principal</label>
                <input 
                    className="form-input"
                    placeholder="Ej. Colección Verano" 
                    value={formSlide.titulo} 
                    onChange={(e)=>setFormSlide({...formSlide, titulo: e.target.value})} 
                />
            </div>
            <div className="form-group full-width">
                <label>Subtítulo</label>
                <input 
                    className="form-input"
                    placeholder="Ej. Descubre lo nuevo..." 
                    value={formSlide.subtitulo} 
                    onChange={(e)=>setFormSlide({...formSlide, subtitulo: e.target.value})} 
                />
            </div>
            <div className="form-group full-width">
                <label>Imagen de Fondo</label>
                <input type="file" accept="image/*" onChange={(e)=>setArchivoSlide(e.target.files[0])} />
            </div>
            
            <div className="form-actions">
                <button onClick={guardarSlide} className="btn btn-primary">
                    Subir Imagen
                </button>
            </div>
          </div>

          <div className="slides-grid">
              {slides.length === 0 && <div className="empty-state">No hay imágenes en el carrusel.</div>}
              
              {slides.map(slide => (
                  <div key={slide.id} className="slide-card">
                      <img src={slide.imagenUrl} alt="slide" className="slide-img" />
                      <div className="slide-content">
                          <h4>{slide.titulo}</h4>
                          <p>{slide.subtitulo}</p>
                          <button onClick={()=>eliminarSlide(slide.id)} className="btn btn-danger" style={{width: '100%'}}>
                              Eliminar
                          </button>
                      </div>
                  </div>
              ))}
          </div>
        </>
      )}

    </div>
  )
}

export default Admin