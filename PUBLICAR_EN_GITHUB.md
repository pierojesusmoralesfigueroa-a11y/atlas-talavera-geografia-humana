# Subir Atlas Talavera V11 a GitHub Pages

**ATENCIÓN:** Este paquete corresponde únicamente al repositorio **`atlas-talavera-geografia-humana`**. No subir al repositorio `atlas-lima-satipo-2026`.

## Opción recomendada: actualización rápida

1. Descarga `Actualizacion_Talavera_V10_a_V11.zip` y extráelo.
2. Abre exactamente: https://github.com/pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana/upload/main
3. En la cabecera verifica que el repositorio se llame **atlas-talavera-geografia-humana** y la rama sea **main**.
4. Arrastra **los archivos descomprimidos**, no el ZIP: `index.html`, `app.js`, `styles.css`, `atlas_export.js`, `README.md`, `VERIFICACION_V11.md` y `PUBLICAR_EN_GITHUB.md`.
5. Verifica especialmente que **`atlas_export.js`** aparece en la raíz. Sin este archivo, las descargas PNG y SVG no funcionarán.
6. Escribe como commit `Atlas Talavera V11: diseño, etiquetas y exportación cartográfica` y pulsa **Commit changes**.
7. En la pestaña Actions comprueba que **pages build and deployment** concluya en verde.
8. Abre https://pierojesusmoralesfigueroa-a11y.github.io/atlas-talavera-geografia-humana/?v=11 y presiona Ctrl+F5. En la cabecera debe leerse **V11**.

## Verificación rápida

- M07: cuatro colores de proximidad, sin que desaparezcan los demás al seleccionar una clase.
- Panel izquierdo: controles de etiquetas y tamaño de símbolos.
- M02: círculos proporcionales a población y etiquetas al acercar.
- Descarga: botón superior «Descargar mapa» → PNG o SVG.
- PNG y SVG exportan datos vectoriales locales sin mosaicos base externos; para los datos originales usa «Descargar GeoJSON».

## Si solo tienes el paquete completo

Extrae `Atlas_Talavera_V11_Profesional_GitHub_Pages.zip` y sube su **contenido** a un repositorio nuevo, con `index.html` en la raíz, junto con `assets/` y `data/`. GitHub Pages: rama main / (root).

**Recuerda:** no mezcles estos archivos con el atlas Lima–Satipo.
