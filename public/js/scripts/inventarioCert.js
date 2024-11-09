import { handleFileSelect } from './uploadFile.js'; // Importar la función desde uploadFile.js
import { procesarXML } from "./certParser.js";

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Eventos para cargar archivos XML manualmente desde input type="file"
    document.getElementById('fileInput1').addEventListener('change', (event) => handleFileSelect(event, 1, window.editor1));

    // Evento para comparar XML al hacer clic en el botón 'Validar'
    document.getElementById('validateButton').addEventListener('click', () => {
        const xmlString = window.editor1.getValue(); // Obtener el contenido de xmlInput1
        procesarXML(xmlString);
alert("Hola");
    });

    if (clearXmlInput1) {
        // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
        document.getElementById('clearXmlInput1').addEventListener('click', () => {
            document.getElementById('fileInput1').value = ''; // Limpiar archivo seleccionado en fileInput1
            fetchXmlFiles(xmlFileSelect); // Llama a la función para cargar opciones desde 'files.json'
        });
    } else {
        console.error('Elemento clearXmlInput1 no encontrado');
    }
});