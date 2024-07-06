document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Archivo subido exitosamente');
        } else {
            alert('Error al subir el archivo');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
    }
});

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