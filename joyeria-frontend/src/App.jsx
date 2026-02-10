import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './pages/catalogo.jsx'
import Login from './pages/login.jsx'
import Admin from './pages/admin.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cuando la ruta sea "/" (inicio), muestra el Catalogo */}
        <Route path="/" element={<Catalogo />} />
        <Route path="/login-joyeria" element={<Login />} />
        <Route path="/admin-panel" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App