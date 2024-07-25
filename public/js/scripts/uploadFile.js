// Función para manejar la carga de archivos XML desde input type="file"
function handleFileSelect(event, fileNumber, editor) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const xmlString = event.target.result;
        editor.setValue(xmlString); // Establecer el contenido del editor (CodeMirror)
    };

    reader.readAsText(file); // Leer el archivo como texto
}

// Exportar la función para que pueda ser utilizada en otros scripts
export { handleFileSelect };