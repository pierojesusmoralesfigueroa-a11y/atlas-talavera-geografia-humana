# Informe de verificación técnica — Talavera V12

**Alcance:** integración sobre la V11, sin edición de geometrías, tablas estadísticas, imágenes de referencia ni rásteres de origen. No sustituye una inspección visual en el navegador real con Leaflet y conexión a Internet.

## Cambios incorporados

1. Ficha de interpretación y precauciones de lectura para **M01 a M12**; estadísticos adicionales de distancia derivados del GeoJSON, cuando corresponde.
2. Comparación por `CODIGO` de 67 centros usando los campos `DIST_KM` de salud y `NEAR_DIST` de primaria, secundaria y vías. Ordenación, búsqueda, aproximación a M04 y exportación CSV de resultados.
3. Selector de clasificación numérica en mapas coropléticos entre intervalos iguales y cuantiles. Los valores originales y las clases de proximidad M04/M05/M07 no cambian.
4. Ampliación de etiquetas para polígonos distritales, coberturas de suelo y establecimientos, con restricciones de zoom; mantiene la supresión aproximada de solapes implementada en V11.
5. Enlaces que conservan tema, posición, zoom, vista, categoría destacada, clasificación, densidad de etiquetas y escala de símbolos.
6. Modo presentación, buscador con sugerencias y ficha imprimible/PDF desde el navegador.
7. Exportación SVG y PNG del ráster activo de M08 mediante imagen local incrustada; leyenda de categorías y título. Se conserva la omisión de mapas base externos.
8. Nueva presentación responsive, estilos de controles y preferencia `prefers-reduced-motion`.

## Advertencias

- **No se calculan** nuevos recorridos viales, accesibilidad real, tiempos de viaje, cobertura sanitaria efectiva ni riesgos anuales.
- En M12, `POB_SIM` no debe confundirse con la estimación oficial y los intervalos del INEI. Cuantiles significa una **clasificación de visualización**, no una nueva estimación.
- La exportación PNG/SVG contiene cartografía propia, no el mosaico externo OSM/OpenTopoMap.
- Las etiquetas de polígonos emplean el centro de sus límites de encuadre; puede haber posiciones poco ideales para geometrías irregulares. Conviene revisar visualmente las clases y rótulos a diferentes escalas.
- Las referencias y licencias de redistribución de fuentes de terceros deben revisarse antes de uso público.

## Pruebas automáticas y de integración

- JavaScript revisado con `node --check` para `app.js`, `atlas_v12.js` y `atlas_export.js`.
- Comparador probado en navegador aislado usando las cuatro capas SIG reales; 67 registros coincidentes, filtrado de KISHUARPATA, CSV separado por `;` y formatos de distancia con seis decimales.
- Ficha de salud recalculó media y máximo para 67 registros sin errores de navegador en la prueba.
- Modo presentación y retorno con Esc; construcción de enlace con el tema y centro de vista.
- Exportación SVG y PNG en navegador aislado para M07; validación de imagen PNG en dimensiones 3300 × 2160.
- M08: ráster de movimientos en masa integrado en SVG mediante imagen embebida; conversión PNG de 3300 × 2160; categorías visibles en la leyenda.
- Dataset `data/` y recursos `assets/` verificados frente a la V11 con hashes, sin cambios de contenido.

**Limitación de las pruebas:** el entorno de navegador automatizado restringe `http://127.0.0.1` por políticas administrativas, así que las pruebas interactivas se realizaron inyectando el código en una página aislada, con objetos cartográficos simulados y los datos SIG verdaderos. Una prueba de publicación real debe comprobar los botones de Leaflet, los mosaicos base, los rótulos y la exportación en la cuenta GitHub Pages.
