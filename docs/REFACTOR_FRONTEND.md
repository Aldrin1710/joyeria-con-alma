# Instrucciones de refactorización del frontend

## Rol y objetivo

Actúa como un desarrollador senior de React. Tu tarea es **refactorizar el frontend** de este proyecto (`joyeria-client/frontend`) para separar responsabilidades y reducir el tamaño de los archivos, **sin cambiar el comportamiento ni el aspecto visual**.

Esto es una refactorización, no una reescritura: la app debe verse y funcionar igual antes y después.

## Contexto del proyecto

- SPA con **React (JSX)** y Vite.
- Solo se toca el **frontend**. No modificar el backend ni los contratos de la API.
- Problema actual: las páginas en `src/pages/` mezclan lógica de negocio, llamadas a la API, estado y JSX en archivos muy grandes.

### Estructura actual (resumen)

```
src/
├── api/          carouselService.js, client.js, productService.js
├── assets/
├── components/   Footer, Navbar, ProductCard, ScrollToTop, WhatsappBtn
├── pages/
│   ├── styles/
│   ├── admin.jsx
│   ├── Catalog.jsx
│   ├── catalogo.jsx      <- posible duplicado de Catalog.jsx
│   ├── Home.jsx
│   ├── login.jsx
│   └── ProductDetail.jsx
├── App.jsx
└── main.jsx
```

## Estructura objetivo (por feature)

Organiza por **tema de negocio**, no por tipo de archivo. Lo que se comparte entre varias páginas vive en `features/`; las páginas solo componen.

```
src/
├── api/                      # solo cliente HTTP base (client.js)
├── assets/
├── features/
│   ├── products/
│   │   ├── api/              # productService.js
│   │   ├── components/       # ProductCard, ProductGrid, ProductFilters, ProductForm, ProductTable
│   │   ├── hooks/            # useProducts, useProduct, useProductForm
│   │   └── utils/            # formatPrice, buildWhatsappLink (si son solo de productos)
│   ├── auth/
│   │   ├── api/              # authService.js
│   │   ├── components/       # LoginForm
│   │   ├── context/          # AuthContext.jsx
│   │   └── hooks/            # useAuth
│   └── carousel/
│       ├── api/              # carouselService.js
│       ├── components/       # HeroCarousel
│       └── hooks/            # useCarousel
├── components/               # SOLO piezas realmente compartidas y genéricas
│   ├── layout/               # Navbar, Footer, ScrollToTop
│   └── ui/                   # Button, Modal, Loader, ErrorMessage, WhatsappBtn
├── hooks/                    # SOLO hooks genéricos (useDebounce, etc.)
├── routes/                   # ProtectedRoute y definición de rutas
├── utils/                    # SOLO funciones puras genéricas
├── pages/                    # Home, Catalog, ProductDetail, Login, Admin
│   └── styles/
├── App.jsx
└── main.jsx
```

Si algún feature no tiene contenido real, no crees la carpeta vacía.

## Responsabilidad de cada capa

| Capa | Qué SÍ hace | Qué NO hace |
|---|---|---|
| **pages/** | Compone la pantalla con features y componentes. Lee parámetros de ruta. | Llamar a la API, manejar estado complejo, contener lógica de negocio. |
| **components/** | Pinta UI a partir de props. | `fetch`/`axios`, conocer rutas, depender de contexto de otro feature. |
| **hooks/** | Estado y efectos (carga de datos, filtros, formularios). Llaman a servicios. | Devolver JSX. |
| **context/** | Estado global compartido (sesión, token, `logout`). | Guardar estado que solo usan uno o dos componentes cercanos. |
| **api/** | Hablar con el backend y devolver datos. | Usar estado de React o JSX. |
| **utils/** | Funciones puras: reciben algo, devuelven algo. | Usar hooks, estado o efectos. |

## Reglas obligatorias

1. **No cambiar comportamiento ni UI.** Mismos textos, estilos, clases CSS, rutas y flujos.
2. **Ningún archivo debe pasar de ~150 líneas.** Si pasa, extrae componentes o hooks.
3. **Ningún componente hace llamadas HTTP.** Van en `api/` y se consumen desde hooks.
4. **Nombres consistentes:**
   - Componentes y páginas en `PascalCase` (`Admin.jsx`, `Login.jsx`, no `admin.jsx` ni `login.jsx`).
   - Hooks en `camelCase` con prefijo `use` (`useProducts.js`).
   - Utils y servicios en `camelCase` (`formatPrice.js`, `productService.js`).
5. **Un componente por archivo**, con `export default` para componentes y páginas, y exports nombrados para hooks y utils.
6. **Sin código duplicado.** Si la misma lógica aparece en dos páginas, extráela a un hook o util.
7. **No agregar dependencias nuevas** sin pedir confirmación.
8. **No dejar código muerto:** elimina imports sin usar, variables sin usar y `console.log` de depuración.
9. **Tipado de props:** mantén lo que ya exista; no introduzcas TypeScript en este paso.
10. **Actualiza todos los imports** tras mover archivos. La app debe compilar sin errores.

## Casos específicos que debes resolver

- **`Catalog.jsx` vs `catalogo.jsx`:** parecen duplicados. Compara ambos, indica las diferencias y **pregúntame cuál es el correcto antes de borrar nada**. Conserva uno solo con nombre `Catalog.jsx`.
- **`admin.jsx` y `login.jsx`:** renómbralos a `Admin.jsx` y `Login.jsx` y actualiza imports y rutas.
- **`ProductCard.jsx`:** muévelo a `features/products/components/`.
- **`WhatsappBtn.jsx`:** si construye el mensaje con datos de producto, extrae esa lógica a `utils/` y deja el componente solo con UI.
- **Sesión/autenticación:** si el token o estado de login está en `login.jsx`, `admin.jsx` o `Navbar.jsx`, centralízalo en `AuthContext` y expón un hook `useAuth`. Crea un `ProtectedRoute` para `Admin`.
- **Formateo de precios, fechas y enlaces:** extrae a `utils/` y reemplaza todas las repeticiones.

## Proceso a seguir (paso a paso)

Trabaja en este orden y **detente al final de cada fase** para que yo valide:

1. **Análisis (sin modificar nada).** Lista cada archivo de `pages/` y `components/` con: número de líneas, qué responsabilidades mezcla y qué propones extraer. Presenta el plan completo.
2. **Limpieza base.** Resolver duplicado `Catalog`/`catalogo`, unificar nombres a PascalCase, eliminar código muerto.
3. **Capa de datos.** Mover servicios a `features/*/api/` y crear los hooks (`useProducts`, `useProduct`, `useCarousel`, `useAuth`) con estados `loading`, `error` y `data`.
4. **Componentes.** Extraer los bloques visuales grandes de cada página a componentes dentro de su feature.
5. **Utils y context.** Mover funciones puras a `utils/` y crear `AuthContext` y `ProtectedRoute`.
6. **Páginas finales.** Dejar cada página como una composición corta de hooks y componentes.
7. **Verificación.** Revisa que no queden imports rotos, archivos sobre 150 líneas ni llamadas HTTP dentro de componentes.

## Ejemplo del resultado esperado

**Antes:** `pages/Catalog.jsx` con 400 líneas de `fetch`, filtros, estado y JSX mezclados.

**Después:**

```jsx
// features/products/hooks/useProducts.js
import { useEffect, useState } from "react";
import { getProducts } from "../api/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
```

```jsx
// pages/Catalog.jsx
import { useProducts } from "../features/products/hooks/useProducts";
import ProductGrid from "../features/products/components/ProductGrid";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Catalog() {
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage />;
  return <ProductGrid products={products} />;
}
```

## Formato de tu respuesta

- Al terminar cada fase, entrega un **resumen breve**: qué moviste, qué creaste y qué eliminaste.
- Muestra el **árbol de directorios resultante** de lo que cambió.
- Señala cualquier **decisión que requiera mi confirmación** en lugar de asumirla.
- Si encuentras bugs preexistentes, **repórtalos sin corregirlos** salvo que impidan la refactorización.

## Criterios de aceptación

- [ ] La app compila y se comporta igual que antes.
- [ ] Ninguna página contiene llamadas HTTP directas.
- [ ] Ningún archivo supera ~150 líneas.
- [ ] No hay componentes duplicados ni nombres inconsistentes.
- [ ] La lógica con estado vive en hooks, la global en context y las funciones puras en utils.
- [ ] Todo lo compartido entre páginas está en `features/` o en `components/`, `hooks/` y `utils/` genéricos.
