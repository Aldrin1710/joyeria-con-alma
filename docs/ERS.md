# Especificación de Requisitos de Software (ERS)
**Proyecto:** Joyería con Alma 2.0  
**Fecha:** Octubre 2026  
**Arquitectura Core:** MERN Stack (React.js, Node.js, Express, MongoDB)  

---

## 1. Visión General
Una plataforma de catálogo visual y Landing Page enfocada en la exhibición de joyería regional yucateca. Funciona como un portafolio de inspiración para piezas únicas, personalizables y sobre pedido. El cierre de venta y la atención al cliente se delegan 100% a WhatsApp para mantener un trato cercano y personalizado.

---

## 2. Arquitectura y Stack Tecnológico
* **Frontend:** React 19 + Vite (Refactorizado a componentes modulares).
* **Backend:** Node.js con Express.
* **Base de Datos:** MongoDB Atlas (NoSQL, ideal para esquemas dinámicos y arreglos de hashtags).
* **Hosting:** Vercel (Frontend) y Render/Vercel Serverless (Backend).
* **Gestión de Medios:** Cloudinary (Almacenamiento de imágenes optimizadas).

---

## 3. Estructura de Interfaz y Rutas (UI/UX)

### 3.1. Rutas del Sistema
* `/` -> **Landing Page** (Página principal estructurada para conversión).
* `/catalogo` -> **Catálogo Completo** (Grid infinito con filtrado).
* `/producto/:id` -> **Vista de Detalle** (Enfoque en storytelling y ventas cruzadas).
* `/login-joyeria` -> **Acceso a Dueños**.
* `/admin-panel` -> **CMS / Gestor de Contenidos**.

### 3.2. Layout de la Landing Page (`/`)
1. **Header:** Logo, navegación y barra de búsqueda global.
2. **Hero Section:** Carrusel dinámico gestionable desde el panel de administración.
3. **Productos Destacados:** Slider horizontal con los últimos productos agregados. La última tarjeta funciona como botón "Ver más..." hacia el catálogo completo.
4. **Comunidad (Social Media):** Grid visual tipo Instagram (potencialmente automatizado vía Widget como Elfsight).
5. **Nosotros:** Breve historia resaltando el valor artesanal.
6. **Footer:** Derechos reservados, links de interés, contacto y redes sociales.

### 3.3. Vista de Detalle del Producto (`/producto/:id`)
* **Visual:** Fotografía en gran formato.
* **Datos Principales:** Título, Precio base y Etiqueta de Disponibilidad.
* **Descripción:** Texto rico narrando la historia de la pieza.
* **Atributos Dinámicos:** Lista de viñetas con claves y valores específicos de esa pieza (ej. Talla, Material, Tipo de flor).
* **Hashtags:** Botones clicables que redirigen al catálogo filtrado.
* **CTA Principal:** Botón inmenso para "Cotizar por WhatsApp".
* **Ventas Cruzadas:** Sección inferior "Te podría interesar" mostrando tarjetas de otros productos que comparten los mismos hashtags.

### 3.4. Tarjeta de Producto (En Catálogo y Sliders)
* **Diseño Minimalista:** Sin descripciones largas ni listas de atributos.
* **Elementos:** Foto limpia (área clicable hacia el detalle), Título, Precio (opcional), Etiqueta de disponibilidad.
* **Acción Rápida (Quick Action):** Botón o ícono sutil de WhatsApp directamente en la tarjeta para usuarios decididos, evitando fricción.

---

## 4. Modelo de Datos (MongoDB)

### Colección: `Products`
* `_id`: ObjectId
* `nombre`: String (Indexado para búsqueda full-text)
* `descripcion`: String
* `precioBase`: Number (Opcional)
* `imagenes`: Array de Strings (URLs de Cloudinary)
* `detalles`: Array de Objetos `[{ clave: String, valor: String }]` (Atributos dinámicos variables)
* `hashtags`: Array de Strings (Indexado para filtrado rápido)
* `estado`: Enum `['EN_STOCK', 'BAJO_ENCARGO', 'AGOTADO', 'BORRADOR']`
* `deletedAt`: Date (Opcional. Indica si el producto está en la papelera)
* `createdAt`, `updatedAt`: Timestamps

### Colección: `Users`
* `username`: String (Unique)
* `passwordHash`: String (Bcrypt)
* `rol`: String `ADMIN`

### Colección: `CarouselSlides`
* `titulo`, `subtitulo`, `imageUrl`, `targetUrl` (Opcional. Link al hacer clic), `orden`, `isActive`

---

## 5. Requisitos Funcionales (RF)

* **RF1 (Gestión de Catálogo):** El admin puede hacer CRUD de productos, asignando atributos dinámicos (detalles) y múltiples hashtags.
* **RF2 (Restricción Multimedia):** El sistema solo permitirá subir imágenes en formato `.jpg`, `.jpeg` o `.png`. Se validará peso máximo (ej. 5MB) en cliente y servidor.
* **RF3 (Sincronización de Borrado):** Al borrar un producto o slide, el servidor debe hacer el llamado a la API de Cloudinary para destruir la imagen y no acumular basura.
* **RF4 (Motor de Filtrado):** Búsqueda por coincidencia de texto y filtrado estricto al hacer clic en hashtags. Con "debounce" de 300ms en el input.
* **RF5 (Enlaces WhatsApp Dinámicos):** El sistema debe generar una URI `wa.me` inyectando el ID y Nombre del producto. Este enlace estará presente tanto en el botón de "Acción Rápida" de las tarjetas como en el botón principal de la vista de detalle.
* **RF6 (Motor de Productos Relacionados):** La vista de detalle debe consultar productos cuyo array de `hashtags` tenga intersección (coincidencias) con el producto actual.
* **RF7 (Gestión Hero):** Admin puede subir, reordenar y eliminar imágenes promocionales del inicio.
* **RF8 (Seguridad de Sesión):** Autenticación vía JWT utilizando cookies `HttpOnly`, `Secure` y `SameSite=Strict`. Prohibido el uso de `sessionStorage` para almacenar tokens.
* **RF9 (Paginación / Scroll):** El catálogo general debe implementar carga diferida (ej. Infinite Scroll o Paginación clásica) cargando baches de 12 a 20 productos a la vez.
* **RF10 (Papelera de Reciclaje):** Los productos eliminados irán a una "papelera" (marcados con `deletedAt`). El administrador podrá vaciar la papelera manualmente, o el sistema los purgará automáticamente después de 15 días.

---

## 6. Requisitos No Funcionales (RNF)

* **RNF1 (Open Graph / SEO Social):** Cada ruta de detalle de producto debe inyectar meta-tags dinámicas para que al compartir el link en WhatsApp o Facebook, se renderice una tarjeta con la foto y el título del producto.
* **RNF2 (Mobile-First):** La UI debe estar diseñada prioritariamente para visualización en teléfonos móviles.
* **RNF3 (Manejo de Errores):** La API backend debe contar con un middleware global de errores estandarizado. Ninguna excepción no controlada debe detener la ejecución de Node.js.
* **RNF4 (Seguridad API):** Implementación de "Rate Limiting" en el endpoint de login (max 5 intentos / 15 min) y sanitización contra inyección NoSQL.
* **RNF5 (Optimización de Carga):** Las imágenes entregadas por Cloudinary deben transformarse automáticamente al tamaño necesario y utilizar formatos modernos de compresión al vuelo.
