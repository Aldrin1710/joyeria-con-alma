# Joyería con Alma 💎

Plataforma web de comercio electrónico y catálogo interactivo para **Joyería con Alma**, boutique de joyería artesanal y filigrana yucateca. Incluye tienda pública mobile-first, cotización directa por WhatsApp y panel administrativo protegido con gestión de inventario, carrusel y papelera de reciclaje.

---

## 📁 Estructura del Monorepo

```text
joyeria-con-alma/
├── backend/            # API REST (Node.js, Express, TypeScript, MongoDB, Cloudinary)
├── frontend/           # Aplicación Web React (Vite, CSS modular accesible WCAG AAA)
├── docs/               # Evidencias de diseño, pruebas de usabilidad y capturas
├── .gitignore          # Reglas unificadas para ignorar dependencias y variables de entorno
└── README.md           # Documentación general del proyecto
```

---

## 🛠️ Tecnologías

* **Frontend:** React 18, Vite, React Router DOM, Lucide / React Icons, Axios.
* **Backend:** Node.js, Express, TypeScript, Mongoose (MongoDB), JWT con Cookies `HttpOnly`, Bcryptjs, Multer + Cloudinary.
* **Base de Datos:** MongoDB.

---

## 🚀 Puesta en Marcha en Desarrollo

### 1. Clonar y preparar entorno
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (v18+) y una instancia de MongoDB corriendo (localmente en `127.0.0.1:27017` o en MongoDB Atlas).

### 2. Configurar y levantar el Backend
```bash
cd backend
npm install
npm run seed     # (Opcional) Poblar base de datos con admin y joyas iniciales
npm run dev      # Inicia la API en http://localhost:5000
```

### 3. Configurar y levantar el Frontend
```bash
cd frontend
npm install
npm run dev      # Inicia el cliente en http://localhost:5173
```

---

## 🔐 Panel de Administración

* **Ruta de acceso:** `/login-joyeria`
* **Duración de sesión:** 2 horas de inactividad (renovación automática por cookies seguras).

---

## 📱 Cotización en WhatsApp
Los botones de cotización dirigen al número configurado en `.env` (`VITE_WHATSAPP_NUMBER`), enviando automáticamente el nombre de la pieza seleccionada de manera natural para el cliente.
