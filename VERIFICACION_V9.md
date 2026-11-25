# Auditoría y validación · Atlas Talavera V9

**Versión:** 25 de noviembre de 2026.

El paquete publica 12 mapas temáticos M01–M12, 21 capas GeoJSON y dos imágenes ráster de susceptibilidad, además de tres imágenes cartográficas de apoyo generadas desde las geometrías y cifras existentes para M10–M12. No se modificaron los atributos ni las geometrías de los GeoJSON originales; solo se amplió el catálogo de visualización M11 para activar los 66 centros poblados contextuales.

## Comprobaciones cuantitativas

| Recurso | Recuento o clasificaciones |
| --- | --- |
| M02 (población) | 67 centros; 5 clases: 32, 20, 11, 3 y 1; máximo 11 691 habitantes |
| M04 (salud) | 67 centros; cuatro clases: 12, 25, 23 y 7 |
| M05 (primaria) | 67 centros; 19, 9, 30 y 9; 60 locales educativos |
| M05 (secundaria) | 67 centros; 28, 16, 19 y 4 |
| M07 (vías principales) | 67 centros; 15, 27, 18 y 7 |
| M11 (turismo) | Cinco registros oficiales; dos urbano-culturales, uno arqueológico, uno natural y una festividad. 66 localidades adicionales de contexto |

Las clases se calculan a partir de DIST_KM o NEAR_DIST/1000 según los campos de cada capa. Se usan los cortes documentados de las láminas A3; las distancias son euclidianas.

## Funcionamiento de interfaz

- Lógica JavaScript sintácticamente comprobada mediante Node.
- Prueba de interacción simulada en Chromium con 21 capas y 20 distritos: se verificó selección de M02, M04, M05 secundaria, M07, M11; leyendas, recuentos, filtro M04 y las cinco tarjetas del turismo. No se observaron errores JavaScript en esa prueba.
- **Limitación:** la captura de prueba usó un sustituto de Leaflet porque el navegador de este entorno bloquea el acceso HTTP local y al CDN externo. No equivale a una validación visual completa de los mapas Leaflet reales; comprobar en un navegador normal y después de desplegar en GitHub Pages.
- Los rasters y las geometrías se mantuvieron de V8.

## Publicación GitHub

Archivo `index.html`, `.nojekyll`, `app.js`, `styles.css`, carpetas `assets/` y `data/` en la raíz. No se requiere un backend. Publicar en un repositorio nuevo de Talavera para no tocar `atlas-lima-satipo-2026`.
