# Plan de Desarrollo Frontend - Joyería con Alma 2.0

## 1. Qué se va a construir
Una Single Page Application (SPA) para "Joyería con Alma" que funcionará como una Landing Page orientada a la conversión y un catálogo digital navegable. El sistema priorizará la exhibición visual de joyería artesanal, permitiendo filtrado dinámico por hashtags y delegando el flujo de venta final a una integración directa y sin fricciones con WhatsApp. 

## 2. Arquitectura Básica y Stack Tecnológico
* **Core:** React 19 + Vite (Rendimiento rápido de desarrollo y construcción).
* **Enrutamiento:** React Router DOM v7 (Manejo de rutas en cliente: `/`, `/catalogo`, `/producto/:id`).
* **Estilos:** CSS estándar con variables globales (CSS Variables) para la paleta de colores y tipografía. Arquitectura de clases tipo BEM o modular para evitar colisiones.
* **Consumo de API:** Axios (Configurado con interceptores para manejo global de errores y tokens).
* **Estado Global:** React Context API (Solo para sesión de admin/UI state global si es necesario; el catálogo se manejará con estado local para mantenerlo simple).
* **Iconografía:** `react-icons` (Específicamente FontAwesome/Material para botones sociales y acciones).

## 3. Tareas Desglosadas y Criterios de Aceptación

### Definición de Hecho General (Definition of Done - DoD)
*Aplica para todas las tareas de programación a menos que se indique lo contrario:*
1. El código no arroja errores ni *warnings* en la consola del navegador.
2. La interfaz es 100% responsiva (se ve bien en pantallas de 320px hasta 1920px).
3. Cumple las reglas tipográficas WCAG (Interlineado 1.5, tamaño base 16px, contraste adecuado).
4. El código ha pasado por una revisión de `ESLint`.

---

### Módulo 1: Configuración Base y Arquitectura
* **Tarea 1.1: Inicialización y limpieza del proyecto.**
  * *Criterio:* Proyecto Vite creado, dependencias instaladas (Axios, React Router). Archivos boilerplate eliminados.
* **Tarea 1.2: Configuración de Estilos Globales.**
  * *Criterio:* Archivo `index.css` configurado con variables de color (Dorados, Negros, Grises), importación de fuentes (Playfair Display, Source Sans 3) y reglas de reseteo.
* **Tarea 1.3: Configuración del Enrutador (Router).**
  * *Criterio:* Archivo `App.jsx` define las rutas base (`/`, `/catalogo`, `/producto/:id`, `/*` para 404).

### Módulo 2: Componentes Core (UI Reutilizable)
* **Tarea 2.1: Componente Navbar.**
  * *Criterio:* Muestra logo y links. En móvil colapsa en un menú hamburguesa funcional. Resalta la ruta activa.
* **Tarea 2.2: Componente Footer.**
  * *Criterio:* Muestra información de copyright, links sociales funcionales y texto descriptivo.
* **Tarea 2.3: Componente ProductCard.**
  * *Criterio:* Renderiza imagen, título, precio, etiqueta condicional (ej. "En Stock") y el botón de "Cotiza ya" con la URI dinámica de WhatsApp pre-armada.

### Módulo 3: Landing Page (`/`)
* **Tarea 3.1: Sección Hero (Carrusel).**
  * *Criterio:* Muestra imagen a pantalla completa con título superpuesto. Transiciona automáticamente cada 5 segundos. Botón "Ver Colección" funciona.
* **Tarea 3.2: Sección Productos Destacados.**
  * *Criterio:* Slider de scroll horizontal que consume los 4 últimos productos. Incluye flechas de navegación izquierda/derecha funcionales (solo en desktop). La última tarjeta redirige al catálogo.
* **Tarea 3.3: Sección Nosotros y Comunidad.**
  * *Criterio:* Renderiza la foto de la creadora con la historia. Renderiza el iframe de Facebook responsivo sin espacios en blanco alrededor.

### Módulo 4: Catálogo (`/catalogo`)
* **Tarea 4.1: Renderizado del Grid General.**
  * *Criterio:* Muestra todos los productos en una cuadrícula CSS adaptable. Muestra "Empty state" si no hay productos.
* **Tarea 4.2: Lógica de Filtrado por Hashtags.**
  * *Criterio:* Extrae hashtags únicos de la lista de productos y los vuelve botones. Al hacer clic, filtra la vista instantáneamente. El hashtag seleccionado cambia de color.
* **Tarea 4.3: Buscador de Texto con Autocompletado.**
  * *Criterio:* Barra de búsqueda que, al teclear, despliega un panel inferior flotante con "Sugerencias de búsqueda" (productos que coinciden parcial o exactamente con el input). OJO: El grid de productos del catálogo NO debe actualizarse en tiempo real; la vista principal solo se filtrará cuando el usuario presione la tecla "Enter" o haga clic explícito en el botón de "Buscar".
* **Tarea 4.4: Implementación de Paginación.**
  * *Criterio:* Carga y renderiza exactamente 15 productos por página. Botón "Cargar más" o Infinite Scroll inyecta el siguiente lote de 15.

### Módulo 5: Detalle de Producto (`/producto/:id`)
* **Tarea 5.1: Layout de vista dividida.**
  * *Criterio:* Diseño a dos columnas en desktop (Foto izq, texto der) y apilado en móvil.
* **Tarea 5.2: Renderizado de Atributos Dinámicos.**
  * *Criterio:* Lee el arreglo `detalles` y lo renderiza en una lista `<ul>`. Si el arreglo está vacío, la sección se oculta sin romper el diseño.
* **Tarea 5.3: Lógica de Productos Relacionados.**
  * *Criterio:* Un algoritmo busca en el estado global otros 3 productos que tengan al menos 1 hashtag en común. Se renderizan debajo de la vista principal.

### Módulo 6: Integración API (Conexión Backend)
* **Tarea 6.1: Servicio HTTP (Axios).**
  * *Criterio:* Creación de `api/client.js` con la baseURL obtenida de variables de entorno `.env`.
* **Tarea 6.2: Consumo de Endpoints.**
  * *Criterio:* Sustitución de `mockData.js` por llamadas reales (`GET /api/productos`, `GET /api/slides`).
* **Tarea 6.3: Manejo de Estados de Carga y Error.**
  * *Criterio:* Mientras la petición está en vuelo, se muestra un esqueleto de carga (Skeleton loading) o un spinner. Si la petición falla, se muestra un mensaje de error amigable ("No pudimos cargar el catálogo").

### Módulo 7: Pruebas y Optimización
* **Tarea 7.1: Inyección de Open Graph (SEO Social).**
  * *Criterio:* Uso de React Helmet o manipulación del DOM para inyectar `<meta property="og:image">` dinámico en la vista de detalle.
* **Tarea 7.2: Auditoría Lighthouse.**
  * *Criterio:* El reporte de Chrome Lighthouse arroja >90 en Accesibilidad y >80 en Rendimiento Móvil.
* **Tarea 7.3: Verificación de Flujo de WhatsApp.**
  * *Criterio:* Prueba manual verificando que hacer clic en 3 productos distintos abra WhatsApp con el nombre y ID correcto.

---

## 4. Reglas Clave y Detalles a Considerar
1. **Regla del Número Único:** El número telefónico de WhatsApp y el texto base (`https://wa.me/...`) DEBEN guardarse como variables de entorno (`VITE_WHATSAPP_NUMBER`). Nunca deben estar hardcodeados en los componentes. Esto evita errores si en un futuro la línea cambia.
2. **Defensividad con Imágenes:** Toda etiqueta `<img>` debe tener un atributo `alt` descriptivo (obligatorio para WCAG) y un `onError` fallback, por si la URL de Cloudinary llegase a fallar, mostrando una imagen gris por defecto.
3. **Scroll Restoration:** En las SPA (React), al navegar de la página principal hacia el catálogo, el navegador suele quedarse "abajo". Se debe implementar un componente `<ScrollToTop />` que regrese la vista a `Y:0` cada vez que la ruta cambia.
4. **Protección de Datos:** Aunque este es el frontend "público", bajo ninguna circunstancia se debe incluir código relacionado con la administración (como botones ocultos con `display: none`) en las vistas de clientes; todo panel admin será estrictamente una ruta separada.
