# Backend - Joyería con Alma 2.0 (REST API)

API REST desarrollada con **Node.js**, **Express**, **TypeScript** y **MongoDB Atlas (Mongoose)**.

---

## 🚀 Requisitos Previos

1. **Node.js** (v18 o superior).
2. Instancia de **MongoDB** (Local o cuenta gratuita de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
3. (Opcional para subida real de imágenes) Cuenta en [Cloudinary](https://cloudinary.com/).

---

## 🛠️ Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Variables de Entorno:**
   Copia el archivo `.env.example` a `.env` y coloca tu cadena de conexión de MongoDB:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/joyeria_con_alma?retryWrites=true&w=majority
   JWT_SECRET=super_secreto_cambiar_en_produccion_123456789!
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

3. **Poblar datos iniciales (Seed):**
   Crea el usuario administrador inicial, slides del hero y 5 productos de prueba:
   ```bash
   npm run seed
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Compilar a producción:**
   ```bash
   npm run build
   npm start
   ```

---

## 📌 Resumen de Endpoints

### 🔓 Públicos
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor |
| `GET` | `/api/productos` | Catálogo paginado (`?page=1&limit=15&hashtag=X&search=Y`) |
| `GET` | `/api/productos/search-suggestions?q=palabra` | Sugerencias rápidas para el autocompletado |
| `GET` | `/api/productos/hashtags` | Lista única de etiquetas para botones de filtro |
| `GET` | `/api/productos/:id` | Detalle de producto + productos relacionados |
| `GET` | `/api/carrusel` | Slides activos ordenados para el Hero |

### 🔐 Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Inicia sesión y genera cookie `HttpOnly` (Con rate limiting) |
| `POST` | `/api/auth/logout` | Limpia la cookie de sesión |
| `GET` | `/api/auth/me` | Verifica sesión activa y devuelve datos del admin |

### 🛡️ Administración (Requiere Cookie JWT)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/admin/productos` | Lista administrativa (incluye borradores o papelera) |
| `POST` | `/api/admin/productos` | Crea producto con imágenes (Multer -> Cloudinary) |
| `PUT` | `/api/admin/productos/:id` | Actualiza producto e imágenes |
| `DELETE` | `/api/admin/productos/:id` | Mueve el producto a la **Papelera** (`deletedAt`) |
| `PATCH` | `/api/admin/productos/:id/restore` | Restaura el producto de la papelera |
| `DELETE` | `/api/admin/productos/:id/permanent` | Elimina producto permanentemente y destruye fotos en Cloudinary |
| `DELETE` | `/api/admin/papelera` | Vacía toda la papelera y destruye fotos en Cloudinary |
| `GET` | `/api/admin/slides` | Lista completa de banners |
| `POST` | `/api/admin/slides` | Crea banner con imagen |
| `PUT` | `/api/admin/slides/:id` | Actualiza banner |
| `DELETE` | `/api/admin/slides/:id` | Elimina banner y su imagen |
