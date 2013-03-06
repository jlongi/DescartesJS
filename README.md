# DescartesHTML5

Interprete para lecciones de Descartes (http://arquimedes.matem.unam.mx/), desarrollado con Javascript y HTML5.


## Modo de uso:

Descargar el archivo descartes-min.js, en el mismo directorio que la lección de Descartes que se desea interpretar.

Agregar al archivo de la lección de Descartes las siguientes 2 lineas, dentro de las etiquetas \<head\> y \</head\>:

  \<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /\>
  
  \<script type="text/javascript" src="descartes-min.js"\>\</script\>

    
## Project Map

### Cosas por hacer
* Espacios tridimensionales.

### Caracteristicas desarrolladas
* Pleca en el escenario
    - el título
    - el subtítulo
    - la imagen de fondo
    - el color del fondo
    - la alineación del texto
    - la tipografía del título y del subtítulo
    - el ajuste del numero de líneas en el subtítulo

* Espacios 2D:
    - el identificador
    - la posición en X y Y
    - el ancho y el alto, con valores en pixeles y en porcentajes
    - la condición de dibujar-si
    - la opción del espacio fijo, si el espacio no esta fijo es posible mover la posición del origen del espacio por medio del arrastre con el mouse
    - la escala
    - la posición del origen Ox y Oy
    - la imagen del fondo y la posición donde se coloca
    - el color del fondo, la red, la red10, los ejes y el texto
    - los números en los ejes
    - la leyenda que se muestra en cada eje
    - la opción de sensible_a_los_movimientos_del_ratón
    - la posición del mouse, con mouse_x y mouse_y
    - se agrego el atributo NombreDelEspacio.image y NombreDelEspacio.back, para obtener una imagen correspondiente al contenido de un espacio y del fondo respectivamente

* Espacios AP:
    - el identificador
    - la posición en X y Y, con valores en píxeles y en porcentajes
    - el ancho y el alto, con valores en píxeles y en porcentajes
    - la condición de dibujar-si
    - el color del fondo
    - la imagen que se muestra cuando la lección externa no se pudo cargar y la posición donde se coloca

* Espacios HTMLIframe:
    - el identificador
    - la posición en X y Y, con valores en píxeles y en porcentajes
    - el ancho y el alto, con valores en píxeles y en porcentajes
    - la condición de dibujar-si
    - el color del fondo
    - el nombre del archivo
    - estos espacios además pueden tener comunicación con la lección contenedora

* Espacios 3D:
    - el identificador
    - la posición en X y Y
    - el ancho y el alto, con valores en pixeles y en porcentajes
    - la condición de dibujar-si

* Controles:
    - Control numérico:
        - Pulsador
            - el identificador y el acceso al valor del control por medio de esté
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - el valor (soporta expresiones)
            - el incremento (soporta expresiones)
            - el mínimo y el máximo (soporta expresiones)
            - la opción de valores discretos
            - el número de decimales (soporta expresiones)
            - la opción de la notación fija
            - la condición de exponencial-si
            - acciones calcular, abrir URL, inicio, limpiar y animar
            - la condición de dibujar-si y activo-si (soporta expresiones)
        - Botón
            - nombre del identificador
            - ubicación del control solo en la región interior
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - la especificación de la tipografía utilizada por el botón
            - la imagen
            - acciones calcular, abrir URL, inicio, limpiar y animar
            - la condición de dibujar-si y activo-si (soporta expresiones)
        - Campo de texto
            - el identificador y el acceso al valor del control por medio de esté
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - el valor (soporta expresiones)
            - el mínimo y el máximo (soporta expresiones)
            - la opción de valores discretos
            - el número de decimales (soporta expresiones)
            - la opción de la notación fija
            - la condición de exponencial-si
            - acciones calcular, abrir URL, inicio, limpiar y animar
            - la condición de dibujar-si y activo-si (soporta expresiones)
            - la opción de solo texto
            - la opción de evaluar y los patrones de respuesta con las pseudo expresiones regulares
        - Menu
            - el identificador y el acceso al valor del control por medio de esté
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - el número de decimales (soporta expresiones)
            - la opción de la notación fija
            - la condición de exponencial-si
            - la opción de visibilidad del campo de texto
            - las opciones soportan la asignación de valores por medio de los corchetes, ej: valor1[100],valor2[-10]
            - acciones calcular, abrir URL, inicio, limpiar y animar
            - la condición de dibujar-si y activo-si (soporta expresiones)
        - Barra
            - el identificador y el acceso al valor del control por medio de esté
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - el valor (soporta expresiones)
            - el incremento se ignora como lo hace Descartes
            - el mínimo y el máximo (soporta expresiones)
            - la opción de valores discretos
            - el número de decimales (soporta expresiones)
            - la opción de la notación fija
            - la condición de exponencial-si
            - la opción de visibilidad del campo de texto
            - acciones calcular, abrir URL, inicio, limpiar y animar
            - la condición de dibujar-si y activo-si (soporta expresiones)
        - Control audio
            - el identificador
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - la condición de dibujar-si y activo-si (soporta expresiones)
            - el nombre del archivo a reproducir
        - Control video
            - el identificador
            - nombre del identificador
            - ubicación del control solo en la región interior y exterior (aunque la región exterior aun no es visible)
            - la posición en X y Y, así como la especificación del ancho y el alto (soporta expresiones)
            - la condición de dibujar-si y activo-si (soporta expresiones)
            - el nombre del archivo a reproducir
    - Control gráfico
        - el identificador
        - el acceso a la posición del control por medio de identificador._x e identificador._y
        - el color exterior del control (el borde) (soporta expresiones)
        - el color interior del control (soporta expresiones)
        - el tamaño del control (soporta expresiones)
        - la posición en X y Y
        - la constricción (aunque falta hacer más pruebas)
        - el texto del control (soporta expresiones)
        - el número de decimales (soporta expresiones)
        - la opción del rastro
        - la imagen
        - la condición de dibujar-si y activo-si (soporta expresiones)

* Auxiliares:
    - Variable
    - Constante
        - evaluar una-sola-vez y siempre
    - Vector
        - evaluar una-sola-vez y siempre
        - tamaño
        - la expresión
        - leer los valores desde un archivo de texto
    - Matriz
        - evaluar una-sola-vez y siempre
        - filas
        - columnas
        - la expresión
    - Función
        - el valor de regreso
        - el algoritmo, los campos de inicio, hacer, mientras
    - Algoritmo
        - evaluar una-sola-vez y siempre
        - los campos de inicio, hacer, mientras
    - Evento
        - la condición (soporta expresiones)
        - acciones calcular, abrir URL, inicio, limpiar y animar
        - la ejecución, una-sola-vez, alternar y siempre

* Gráficos:
    - Ecuación
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el ancho
    - Curva
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el parámetro (soporta expresiones)
        - la opción de relleno
        - el color del relleno (soporta expresiones)
        - el ancho (soporta expresiones)
    - Punto
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el texto (soporta expresiones)
        - el número de decimales para el texto
        - la condición de notación fija
        - el tamaño (soporta expresiones)
    - Segmento
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el texto (soporta expresiones)
        - el número de decimales para el texto
        - la condición de notación fija
        - el tamaño de los puntos finales del segmento (soporta expresiones)
        - el ancho de la linea del segmento (soporta expresiones)
    - Flecha
        - dibujarse en el fondo
        - el color del borde (soporta expresiones)
        - el color interior (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el texto (soporta expresiones)
        - el número de decimales para el texto
        - la condición de notación fija
        - el ancho de la linea de la flecha (soporta expresiones)
        - el tamaño de la punta de la flecha (soporta expresiones)
    - Polígono
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - la opción de relleno
        - el color del relleno (soporta expresiones)
        - el ancho de la linea del polígono (soporta expresiones)
    - Arco
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - la posición del centro (soporta expresiones)
        - el radio (soporta expresiones)
        - el ángulo inicial y final (soporta expresiones)
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el texto (soporta expresiones)
        - el número de decimales para el texto
        - la condición de notación fija
        - la opción de relleno
        - el color del relleno (soporta expresiones)
        - el ancho de la linea del polígono (soporta expresiones)
    - Texto
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - el texto (soporta expresiones)
        - el número de decimales para el texto
        - la condición de notación fija
    - Imagen
        - dibujarse en el fondo
        - el color (soporta expresiones)
        - la condición de dibujar-si (soporta expresiones)
        - la opción de utilizar coordenadas absolutas
        - el rastro (soporta expresiones)
        - la familia (soporta expresiones)
        - la rotación inicial (soporta expresiones)
    - Macros
        - dibujarse en el fondo
        - la condición de dibujar-si (soporta expresiones)
        - la familia (soporta expresiones)
        - la posición inicial (soporta expresiones)
        - la rotación (soporta expresiones)
        - el nombre (no soporta expresiones)

* Animación:
    - la pausa (soporta expresiones)
    - la opción de auto
    - la opción repetir
    - los campos de inicio, hacer, mientras