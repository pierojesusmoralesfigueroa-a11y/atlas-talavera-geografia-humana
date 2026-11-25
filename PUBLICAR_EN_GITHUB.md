# Publicación del Atlas Talavera V9 en GitHub Pages

Este paquete corresponde a un sitio estático. **No debe copiarse al repositorio de Lima–Satipo.**

1. Descomprime `Atlas_Talavera_V9_GitHub_Pages.zip`. La carpeta resultante debe contener `index.html` directamente, junto con `.nojekyll`, `app.js`, `styles.css`, `data/` y `assets/`.
2. En GitHub, crea un repositorio **nuevo y público**, nombre sugerido `atlas-talavera-geografia-humana`. No es el repositorio `atlas-lima-satipo-2026`.
3. Entra al nuevo repositorio, selecciona **Add file → Upload files** y carga **todo el contenido de la carpeta descomprimida** (no el ZIP como un único archivo). Alternativamente usa GitHub Desktop para crear y publicar el repositorio desde la carpeta extraída.
4. Ve a **Settings → Pages**. En **Build and deployment** usa **Deploy from a branch**, rama `main`, carpeta `/(root)`. Guarda.
5. El enlace de publicación previsto es `https://pierojesusmoralesfigueroa-a11y.github.io/atlas-talavera-geografia-humana/` una vez creado y desplegado. No se ha creado ese sitio automáticamente desde esta entrega.
6. Abre el sitio y prueba M02, M04, M05 (primaria/secundaria), M07 y M11. GitHub Pages requiere conexión para Leaflet/OpenStreetMap. Si ves una versión anterior, recarga forzada con **Ctrl + F5**.

**Nota técnica:** los archivos GeoJSON, imágenes y scripts son estáticos y están referenciados por rutas relativas `./`; por eso funcionan cuando el atlas se publica dentro de la subcarpeta del repositorio en GitHub Pages.
