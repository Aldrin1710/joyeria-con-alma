# Plan de Desarrollo Backend - Joyería con Alma 2.0

## 1. Arquitectura Básica y Stack Tecnológico
* **Entorno y Framework:** Node.js con Express.js y TypeScript (Tipado estricto para evitar errores en tiempo de ejecución y asegurar escalabilidad).
* **Base de Datos:** MongoDB Atlas (NoSQL) a través de la librería **Mongoose** (para modelado de esquemas y validación).
* **Autenticación:** JSON Web Tokens (JWT) gestionado a través de **Cookies HttpOnly** (evita ataques XSS).
* **Almacenamiento de Imágenes:** Cloudinary (SDK de Node.js) procesado temporalmente con `multer`.
* **Despliegue planeado:** Render o Vercel (Capa gratuita).

## 2. Tareas Desglosadas y Criterios de Aceptación (DoD)

### Definición de Hecho General (DoD)
1. Todos los endpoints públicos devuelven respuestas rápidas (< 300ms ideal).
2. Las rutas protegidas rechazan peticiones sin cookie JWT válida con un status `401 Unauthorized`.
3. Todos los esquemas de Mongoose tienen validación estricta (no se puede guardar un producto sin nombre o precio).
4. El código no contiene contraseñas ni URIs quemadas (todo usa `.env`).

---

### Módulo 1: Configuración Core y Conexión
* **Tarea 1.1: Inicialización de Express y Middleware base.**
  * *Criterio:* Servidor corriendo en puerto dinámico. Configuración de `cors` (permitiendo credenciales/cookies del frontend), `express.json` y `cookie-parser`.
* **Tarea 1.2: Conexión a MongoDB Atlas.**
  * *Criterio:* Patrón Singleton para conectar a la DB usando `mongoose.connect`. Logs claros de éxito o fallo en consola.

### Módulo 2: Modelado de Datos (Esquemas Mongoose)
* **Tarea 2.1: Modelo de Usuario (Admin).**
  * *Criterio:* Campos `email`, `password` (hasheado con `bcrypt`), `rol`.
* **Tarea 2.2: Modelo de Producto.**
  * *Criterio:* Campos definidos en el ERS. **Crucial:** Implementación de índice TTL en el campo `deletedAt` que elimine automáticamente el documento de MongoDB a los 15 días.
* **Tarea 2.3: Modelo de Carrusel.**
  * *Criterio:* Esquema simple para hero banners (`titulo`, `imageUrl`, `targetUrl`, etc.).

### Módulo 3: Autenticación y Seguridad
* **Tarea 3.1: Endpoint de Login (`POST /api/auth/login`).**
  * *Criterio:* Valida credenciales. Genera un JWT y lo inyecta en una cookie `HttpOnly`, `Secure` (en prod) y `SameSite=Strict`. Retorna datos básicos del usuario.
* **Tarea 3.2: Middleware de Protección (`verifyToken`).**
  * *Criterio:* Función que intercepta rutas privadas, lee la cookie JWT, la verifica y añade el usuario a la request (`req.user`).
* **Tarea 3.3: Endpoint de Logout (`POST /api/auth/logout`).**
  * *Criterio:* Destruye/limpia la cookie JWT del navegador.

### Módulo 4: Catálogo Público y Buscador
* **Tarea 4.1: Endpoint Obtener Catálogo (`GET /api/productos`).**
  * *Criterio:* Endpoint público. Implementa **Paginación estricta** (15 productos por página usando `limit` y `skip`). 
  * *Filtros:* Soporta query `?hashtag=X` para filtrar.
  * *Buscador:* Soporta query `?search=Y` usando `$regex` de MongoDB para búsqueda parcial/exacta en el nombre del producto, *case-insensitive*.
* **Tarea 4.2: Endpoint Autocompletado (`GET /api/productos/search-suggestions`).**
  * *Criterio:* Endpoint súper rápido que recibe un input y devuelve solo un arreglo de nombres e IDs (máximo 5 resultados) para alimentar el dropdown del frontend sin cargar fotos pesadas.
* **Tarea 4.3: Endpoint Detalle de Producto (`GET /api/productos/:id`).**
  * *Criterio:* Devuelve la información completa de una joya por su ID de MongoDB.

### Módulo 5: Gestión Administrativa (CRUD y Papelera)
* **Tarea 5.1: Crear y Actualizar Productos (`POST` y `PUT /api/admin/productos`).**
  * *Criterio:* Rutas protegidas. Validan los datos recibidos y actualizan la base de datos.
* **Tarea 5.2: Soft Delete y Papelera (`DELETE /api/admin/productos/:id`).**
  * *Criterio:* Ruta protegida. No hace un `deleteMany` o `deleteOne`, sino que actualiza el documento poniendo la fecha actual en `deletedAt` (moviéndolo a la papelera).
* **Tarea 5.3: Vaciar Papelera Manualmente (`DELETE /api/admin/papelera`).**
  * *Criterio:* Ruta protegida. Elimina permanentemente todos los documentos donde `deletedAt` no sea nulo.

### Módulo 6: Integración de Imágenes (Cloudinary)
* **Tarea 6.1: Configuración de Multer y Cloudinary.**
  * *Criterio:* Middleware que recibe la imagen del frontend en `multipart/form-data`, la sube a Cloudinary y retorna la URL segura (`https`) para guardarla en MongoDB.

---

## 3. Reglas Clave y Detalles a Considerar
1. **Seguridad de Cookies:** El frontend y el backend deben compartir el mismo dominio base para que las cookies de sesión funcionen correctamente en producción (importante al configurar CORS).
2. **Índices de Rendimiento:** Asegurarse de indexar el campo `nombre` y `hashtags` en MongoDB para que las búsquedas con `$regex` y los filtros sean extremadamente rápidos, incluso si el catálogo crece a miles de productos.
3. **Manejo Centralizado de Errores:** En Express, en lugar de poner `try/catch` gigantes en cada controlador, se usará un middleware de manejo de errores global para mantener el código limpio.
