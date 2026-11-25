# Publicación de Talavera V12 en GitHub Pages

> **ATENCIÓN:** subir exclusivamente a `atlas-talavera-geografia-humana`. El repositorio `atlas-lima-satipo-2026` es otro proyecto y no debe recibir estos archivos.

## Actualización rápida V11 → V12

1. Descargar **`Actualizacion_Talavera_V11_a_V12.zip`** y descomprimirlo en Windows.
2. Abrir el repositorio exacto: <https://github.com/pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana/upload/main>
3. Verificar en la parte superior **`atlas-talavera-geografia-humana`** y rama **`main`**.
4. Seleccionar y arrastrar **los ocho archivos descomprimidos**: `index.html`, `styles.css`, `app.js`, `atlas_export.js`, `atlas_v12.js`, `README.md`, `VERIFICACION_V12.md` y `PUBLICAR_EN_GITHUB.md`.
5. No subir el ZIP directamente. `index.html`, `app.js`, `atlas_export.js` y el **nuevo `atlas_v12.js`** deben quedar en la raíz del repositorio (no dentro de una subcarpeta).
6. Escribir el mensaje de commit: `Atlas Talavera V12 - Interfaz, análisis, comparación y exportación` y seleccionar **Commit changes** en `main`.
7. Confirmar en **Actions** que `pages build and deployment` finalice en verde.
8. Abrir el atlas: <https://pierojesusmoralesfigueroa-a11y.github.io/atlas-talavera-geografia-humana/?v=12> y pulsar **Ctrl + F5**. Verificar **V12** en la cabecera.

## Comprobaciones después de publicar

- M04/M05/M07: cuatro categorías, leyenda, filtros y ficha de interpretación. Abrir **Comparar distancias**: debe mostrar 67 centros y permitir descargar CSV.
- M02: tamaños de círculos por habitantes, etiquetas y densidad de manzanas.
- M03/M09/M10/M12: seleccionar **Cuantiles** y volver a **Intervalos iguales**, y revisar etiquetas distritales.
- M11: abrir las cinco fichas turísticas sin perder el contexto cartográfico.
- Menú superior: **Modo presentación**, **Compartir vista**, **Descargar mapa**.
- M08: activar un ráster, exportar PNG/SVG y revisar que aparezcan sus categorías. La base OSM/OpenTopoMap no se exporta.
- Panel derecho: **Imprimir ficha / PDF** y escoger «Guardar como PDF» si se necesita un archivo PDF.
- Revisar también la visualización en un teléfono o ventana estrecha.

## Instalación desde el ZIP completo

Para un repositorio nuevo, extraer `Atlas_Talavera_V12_Completo_GitHub_Pages.zip` y subir **todo su contenido** a la raíz. En Settings → Pages seleccionar **Deploy from a branch**, `main`, `/(root)`. No necesitas ejecutar Python en GitHub Pages.
