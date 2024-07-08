# Proyecto: Comparar Estructuras XML

Este proyecto es una aplicación web que permite comparar estructuras XML de manera visual. Utiliza varias tecnologías como HTML, CSS, JavaScript, Bootstrap, CodeMirror y jsdiff para proporcionar una interfaz amigable y funcional.

## Características

- **Carga de archivos XML**: Permite cargar archivos XML desde el sistema local o seleccionar desde una lista predefinida.
- **Edición manual de XML**: Proporciona un editor de texto con formato y limpieza para ingresar y modificar XML manualmente.
- **Comparación de estructuras**: Compara dos estructuras XML y muestra las diferencias de forma visual.
- **Gestión de archivos**: Subir y eliminar archivos XML directamente desde la interfaz.

## Estructura del Proyecto

### Archivos y Directorios Principales

- **index.html**: Archivo principal que contiene la estructura HTML de la aplicación.
- **css/styles.css**: Archivo de estilos personalizados.
- **js/main.js**: Script JavaScript principal que maneja la lógica de la aplicación.
- **public/data/files.json**: Archivo JSON que contiene la lista de archivos XML disponibles para selección.

### Dependencias

- **Bootstrap**: Utilizado para el diseño y estilo de la interfaz.
- **CodeMirror**: Utilizado para la edición de XML.
- **jsdiff**: Utilizado para comparar las diferencias entre estructuras XML.
- **js-beautify**: Utilizado para formatear XML.

## Instrucciones de Uso

1. **Cargar archivos XML para comparar**:
   - Seleccione los archivos XML base y a comparar desde su sistema local o desde una lista predefinida.
   - Utilice los botones de radio para seleccionar el tipo de diferencia que desea ver (diferencias en XML o nodos XML).

2. **Ingresar XML manualmente**:
   - Ingrese o edite XML directamente en los campos de texto proporcionados.
   - Utilice los botones "Aplicar Formato" para dar formato al XML ingresado y "Limpiar" para borrar el contenido del campo.

3. **Comparar estructuras XML**:
   - Haga clic en el botón "Comparar" para ver las diferencias entre los XML ingresados o cargados.
   - Las diferencias se mostrarán en el área de resultado.

4. **Gestión de archivos**:
   - Utilice el acordeón para eliminar archivos XML de la lista predefinida o para subir nuevos archivos XML.

## Ejecución del Proyecto

1. Clone el repositorio en su máquina local.
2. Asegúrese de tener Node.js y npm instalados.
3. Navegue al directorio del proyecto y ejecute `npm install` para instalar las dependencias necesarias.
4. Inicie el servidor con `npm start`.
5. Abra un navegador web y vaya a `http://localhost:3000` para ver la aplicación en funcionamiento.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, siga estos pasos para contribuir:

1. Haga un fork del repositorio.
2. Cree una nueva rama para su funcionalidad (`git checkout -b nueva-funcionalidad`).
3. Realice los cambios y haga commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Empuje a la rama (`git push origin nueva-funcionalidad`).
5. Cree un Pull Request en GitHub.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo LICENSE para obtener más detalles.

## Contacto

Si tiene alguna pregunta o sugerencia, no dude en contactar al autor del proyecto.

---

Este README proporciona una visión general y detallada de la aplicación web para comparar estructuras XML. Siga las instrucciones de uso para aprovechar al máximo las funcionalidades de la aplicación.