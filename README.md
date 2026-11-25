# Atlas geográfico-social de Talavera · Versión 9

**Proyecto académico de Geografía Humana (UNMSM, 2026-II).** Autor: Piero Morales. 

Sitio **100 % estático**, preparado para **GitHub Pages**. No usa Streamlit ni necesita API keys de CARTO. El mapa base predeterminado es OpenStreetMap (requiere conexión), y la interfaz usa Leaflet (biblioteca externa). Las geometrías temáticas y los archivos del atlas están incluidos localmente.

## Lo que contiene

- **12 mapas temáticos** (M01–M12), **21 capas GeoJSON reales**, **2 rásteres** categóricos de susceptibilidad convertidos a imágenes georreferenciadas.
- **M02**: 67 centros poblados con círculos cuyo tamaño crece con `POBLACION`, y 203 manzanas urbanas coloreadas por `DENS_HA`.
- **M04**: 67 centros clasificados en cuatro rangos de distancia a establecimientos de salud; capa independiente de 72 servicios de Talavera y entorno.
- **M05**: 67 centros con clasificación diferenciada según distancia a **primaria** o **secundaria**, y 60 locales educativos.
- **M07**: 67 centros coloreados por distancia a vías principales, con carreteras diferenciadas por jerarquía.
- **M11**: cinco recursos con tarjetas seleccionables, límites, vías y mini-mapa del entorno de plaza y templo. Enlaces a fichas oficiales de MINCETUR.
- **M08**: dos rásteres de susceptibilidad de INGEMMET con leyendas cotejadas contra la lámina A3.
- **M09, M10, M12**: 20 distritos, estadísticas y atributos vinculados por UBIGEO.

Los puntos y polígonos proceden de los archivos SIG del proyecto. **No se han generado geometrías ficticias**.

## Abrir en tu computadora

1. Extrae el ZIP. En la raíz deben verse `index.html`, `app.js`, `styles.css`, `assets/` y `data/`.
2. Abre PowerShell dentro de esa carpeta. Ejecuta:

   ```powershell
   py -m http.server 8002
   ```

3. Abre `http://localhost:8002/?v=9`. Si el navegador conserva una versión anterior, pulsa `Ctrl + F5`.
4. En M02, cambia la opción **Qué deseas observar** para comparar símbolos proporcionales y densidad urbana; en M05 alterna primaria/secundaria. Para M11 prueba las cinco tarjetas y el zoom **plaza y templo**.

## Publicar en GitHub Pages

1. Crea un repositorio público nuevo en GitHub, por ejemplo `atlas-talavera-geografia-humana`. **No sobrescribas** `atlas-lima-satipo-2026`.
2. Puedes utilizar **GitHub Desktop**: File → Add local repository (o Create repository) y seleccionar la carpeta extraída; haz commit y Publish repository. Si ya creaste el repositorio remoto, clónalo y copia dentro **el contenido** de esta carpeta (no la carpeta exterior).
3. Confirma que `index.html` esté en la **raíz** del repositorio junto a `.nojekyll`, `data/` y `assets/`. No subas el ZIP como único archivo: hay que extraerlo antes.
4. En GitHub → Settings → Pages → Build and deployment, selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
5. El enlace esperado será `https://TU-USUARIO.github.io/atlas-talavera-geografia-humana/`, siempre que el nombre de repositorio coincida. La publicación puede tardar y debes comprobarla en Settings → Pages.

No requiere que funcione Python en GitHub Pages, porque el navegador consume directamente GeoJSON, PNG, HTML, CSS y JS. El servidor Python del paso anterior solo se usa para pruebas locales.

## Documentación cartográfica y limitaciones

- La simbología de proximidad sigue los cortes de M04, M05 y M07 impresos en las láminas A3 y se refiere a **distancia euclidiana**, no a recorrido ni tiempo de viaje. La nomenclatura de rangos se ofrece en kilómetros.
- M02 representa por separado **población por centro poblado** y **densidad por manzana urbana**: son escalas y variables distintas.
- Los 72 establecimientos sanitarios son la cobertura de análisis de entorno; **14** corresponde a los establecimientos contabilizados específicamente dentro de Talavera en el informe.
- Las estadísticas de distintas fechas no deben mezclarse como si fueran registros simultáneos (Censo 2017; pobreza 2018; etc.).
- Las dos superficies del M08 son categorías de **susceptibilidad**, no riesgo ni probabilidad anual de daños.
- M12: `POB_SIM` es estimación reprocesada; los intervalos y grupos robustos se encuentran en el Anexo Estadístico oficial del INEI.
- La localización del carnaval de Huarataca es un punto de referencia; no es una instalación turística.
- Antes de publicar, revisa licencias de redistribución de capas de terceros, créditos fotográficos y adecuación del acceso público a coordenadas exactas.

## Referencias

Fuentes: INEI, MINSA/SUSALUD, MINEDU, MTC-Provías, MINAM, MIDAGRI, INGEMMET, MINCETUR y cartografía administrativa. Para la procedencia concreta de los datos consulta las láminas A3 y la documentación del proyecto.

**Comprobación:** el contenido y la sintaxis JavaScript se validaron con herramientas automáticas. La interacción gráfica completa debe verificarse al abrir la V10 en tu navegador; el navegador automatizado de este entorno no puede acceder a páginas locales.

## Ajustes profesionales de la versión 9

- **Mapa 02 (población):** el área de los círculos escala aproximadamente con los habitantes de los 67 centros poblados (radio proporcional a la raíz cuadrada). Se amplió el contraste visual, se añadieron etiquetas de localidades importantes, cinco clases en la leyenda y un ranking interactivo. Alterna `Centros`/`Manzanas` sin confundir población con densidad.
- **Mapas 04, 05 y 07 (proximidad):** cuatro categorías según los cortes verificados en A3. Puedes filtrar clases desde el panel lateral o las tarjetas, ver los siete centros con menor distancia dentro de la selección y acercarte a cada uno con un clic. Primaria y secundaria son vistas distintas; la jerarquía vial conserva sus tres tipos.
- **Mapa 11 (turismo):** mantiene exactamente los cinco registros originales de MINCETUR y sus enlaces; muestra puntos poblados, hidrografía y vías como contexto, etiquetas permanentes para los tres recursos más alejados del centro urbano, mini-mapa urbano y fichas por categoría. **No se agregaron atractivos inventados ni rutas supuestas.**
- **Interfaz:** paleta editorial azul tinta / verde petróleo / ocre / marfil, indicaciones contextualizadas por mapa, contraste y selección mejorados.

**Validación local:** ejecutar `py -m http.server 8002`, abrir `http://localhost:8002/?v=9` y verificar con `Ctrl + F5` si el navegador mantiene el caché. Los archivos HTML, JS y GeoJSON se publican directamente con GitHub Pages; no requieren Python en el servidor.

- **Vistas de apoyo M10, M11 y M12:** imágenes JPG producidas a partir de las geometrías y valores realmente incluidos. No se presentan como láminas A3 originales.

Para la publicación se recomienda crear el repositorio **`atlas-talavera-geografia-humana`** en la cuenta `pierojesusmoralesfigueroa-a11y`, independiente del repositorio existente `atlas-lima-satipo-2026`. Tras configurar Pages, la dirección sería `https://pierojesusmoralesfigueroa-a11y.github.io/atlas-talavera-geografia-humana/` (solo funcionará cuando publiques los archivos).


## Corrección V10 · leyenda de proximidad (M04, M05 y M07)

- La leyenda temática permanece activa, incluso cuando se selecciona una vista de **solo equipamientos** o **solo red vial**. En ese caso se aclara que los puntos por distancia están ocultos y se ofrece restaurarlos.
- Las cuatro clases conservan exactamente los intervalos y recuentos de los GeoJSON originales. La nueva paleta y el borde oscuro hacen los círculos más legibles sobre el mapa base.
- Las filas de la leyenda son interactivas: selecciona una categoría para mostrar únicamente sus centros poblados. «Mostrar todas las clases» restaura la selección completa.
- Al abrir M04 y M05 se prioriza una vista de distancia sin símbolos de establecimientos que tapen los círculos. El selector lateral permite volver a mostrar los equipamientos en cualquier momento.
- La leyenda vuelve a mostrarse al cambiar de tema. Los cambios de filtro o de capa conservan el zoom y la posición del mapa; el ajuste de extensión solo ocurre al cambiar de tema o pulsar «Centrar mapa».
- **Interpretación:** las distancias proceden de análisis Near y representan distancia euclidiana, no rutas ni minutos de viaje. No deben interpretarse como disponibilidad real o calidad de los servicios.
