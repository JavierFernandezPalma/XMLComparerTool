
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js

async function handleDeleteFile(event) {
    event.preventDefault();

    const deleteFileSelect = document.getElementById('deleteFileSelect');
    const fileName = deleteFileSelect.value;

    if (fileName) {
        try {
            const response = await fetch('http://localhost:3000/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName })
            });

            if (response.ok) {
                alert('Archivo eliminado exitosamente');
                fetchXmlFiles(deleteFileSelect); // Actualizar la lista de archivos
            } else {
                alert('Error al eliminar el archivo');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    } else {
        alert('Por favor, selecciona un archivo para eliminar');
    }
}

// Exportar la función para que pueda ser utilizada en otros scripts
export { handleDeleteFile };
