# Corrección Atlas Talavera V13.1 · archivos A3

## Problema identificado y comprobado

El repositorio remoto tenía el código V13 actualizado, pero las imágenes `assets/laminas/M10.jpg`, `M11.jpg`, `M12.jpg` eran las de V9. Tampoco contenía los PDF A3 ni las fotografías del M11. Por eso se veía la lámina provisional de V9 pese a la cabecera V13.

## Corrección

Este paquete contiene **todos sus archivos en la raíz** (sin carpetas internas). Se cambiaron únicamente las rutas de acceso a las láminas M10–M12 y fotografías M11, sin editar los datos SIG ni las estadísticas. Es seguro subir el contenido completo de este ZIP a la raíz del repositorio `atlas-talavera-geografia-humana`.

1. Descomprime el ZIP en Windows.
2. Abre `https://github.com/pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana/upload/main`.
3. Selecciona con Ctrl+A **todos los archivos del interior** de la carpeta extraída; arrástralos a GitHub (NO subas el ZIP).
4. Comprueba que GitHub detecta `index.html`, `app.js`, `atlas_export.js`, 3 JPG A3, 3 PDF y 3 fotos.
5. Pulsa **Commit changes** en `main`.
6. Verifica que GitHub Pages termine con círculo verde y abre `https://pierojesusmoralesfigueroa-a11y.github.io/atlas-talavera-geografia-humana/?map=M10&v=13.1`. Presiona Ctrl+F5.

**No modificar** `atlas-lima-satipo-2026`.

### Resultado

- M10: miniatura y ampliación de la lámina original, dos mapas de lengua materna, fuente INEI 2017; PDF descargable.
- M11: miniatura A3 y 3 fotografías de la lámina; PDF descargable.
- M12: miniatura de ambos mapas de pobreza monetaria y grupos robustos, fuente INEI 2018; PDF descargable.
- `Descargar mapa` genera una composición SIG vectorial del visor; `Ver lámina A3` muestra el PDF/lámina original. Son productos distintos.

### Limitaciones

No se han modificado las geometrías ni clases. Las fotos M11 proceden del mapa aportado; verificar licencia y créditos antes de difusión abierta. Se verificó la estructura del ZIP y sintaxis, pero no la visualización final en GitHub Pages.
