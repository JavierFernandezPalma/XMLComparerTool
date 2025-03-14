// Ejecuta cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Esperar a que los elementos estén en el DOM
    setTimeout(() => {
        const uploadForm = document.getElementById('uploadForm');
        const apiUrl = process.env.APP_API_URL || 'https://xmlcomparertool.onrender.com';
        const pathUrl = process.env.FILES_API_PATH || '/api/v1/files'

        if (uploadForm) {
            // Maneja el envío del formulario de subida
            document.getElementById('uploadForm').addEventListener('submit', async function (event) {
                event.preventDefault(); // Previene el envío por defecto

                const formData = new FormData(); // Crea un nuevo FormData
                const fileInput = document.getElementById('fileInput'); // Selecciona el input de archivo
                formData.append('file', fileInput.files[0]); // Añade el archivo a FormData

                try {
                    const response = await fetch(`${apiUrl}${pathUrl}/upload`, { // Envía la petición POST
                        method: 'POST',
                        body: formData
                    });

                    // Muestra resultado
                    response.ok ? alert('Subido con éxito') : alert('Error al subir');
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file');
                }
            });
        } else {
            // console.error('Elemento uploadForm No está en el DOM');
        }
    }, 100); // Ajusta el tiempo según sea necesario
});


// Maneja la carga de archivos para editor (CodeMirror)
function handleFileSelect(event, fileNumber, editor) {
    const file = event.target.files[0]; // Obtiene el archivo
    if (!file) return;

    const reader = new FileReader(); // Instancia FileReader

    reader.onload = function (event) {
        const xmlString = event.target.result;
        editor.setValue(xmlString); // Establecer el contenido del editor (CodeMirror)
    };

    reader.readAsText(file); // Leer el archivo como texto
}

// Exportar la función para que pueda ser utilizada en otros scripts
export { handleFileSelect };