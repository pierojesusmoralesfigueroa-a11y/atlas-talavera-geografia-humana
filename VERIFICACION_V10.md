# Verificación · Atlas Talavera V10

**Alcance:** correcciones de representación y persistencia de leyendas, sin modificar las geometrías ni atributos originales.

## Problema solucionado

En V9, al cambiar a una vista de «solo establecimientos» se reemplazaba la leyenda de proximidad por una leyenda genérica. Además, la gran cantidad de íconos sanitarios superpuestos dificultaba distinguir los círculos de cuatro clases. V10 conserva la leyenda temática al cambiar de vista y prioriza las distancias en el estado inicial de los mapas M04 y M05.

## Cambios

1. M04, M05, M07: leyenda persistente de cuatro categorías, con intervalos, recuentos y filtros por clase.
2. Leyenda interactiva y botón para restaurar el total de clases, incluso cuando estaban ocultas.
3. Colores diferenciables y contorno oscuro de los puntos; los íconos sanitarios son menores.
4. Cada tema activa por defecto los datos de distancia sin superposición de equipamientos en M04 y M05; estos siguen disponibles por selector.
5. Cambiar filtros o vistas no reajusta el zoom automáticamente. Cambiar de tema sí encuadra de nuevo el ámbito.
6. Se mantiene GitHub Pages como HTML estático sin backend.

## Datos

- M04: 67 centros; 12, 25, 23, 7.
- M05 primaria: 67 centros; 19, 9, 30, 9.
- M05 secundaria: 67 centros; 28, 16, 19, 4.
- M07: 67 centros; 15, 27, 18, 7.

**Limitación:** la verificación de navegador con Leaflet real depende del acceso al servicio de teselas. El control automático revisa lógica, navegación, leyendas y eventos con capas originales y Leaflet simulado.
