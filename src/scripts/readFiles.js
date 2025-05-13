// Función para obtener archivos XML desde un archivo JSON (files.json)
function fetchXmlFiles(xmlFileSelect) {

    if (!xmlFileSelect) {
        console.error('Elemento xmlFileSelect no encontrado');
        return;
    } else {
        fetch('/utils/files.json')
            .then(response => response.json())
            .then(data => {
                xmlFileSelect.innerHTML = ''; // Limpiar opciones existentes en el select

                // Recorrer los archivos XML y agregar opciones al select
                data.xmlFiles.forEach((file, index) => {
                    const option = document.createElement('option');
                    option.value = index === 0 ? '' : `/upload/${file}`; // Opción vacía para "Seleccionar archivo XML"
                    option.textContent = file;
                    xmlFileSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching XML files', error));
    }

}

// Exportar la función para que pueda ser utilizada en otros scripts
export { fetchXmlFiles };
