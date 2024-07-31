import { showAlert } from '../utils.js';
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { compareDifXML, clearComparisonResult } from './difXML.js'; // Importar funciones desde diffXML.js
import { handleFileSelect } from './uploadFile.js'; // Importar la función desde uploadFile.js
import { handleDeleteFile } from './deleteFile.js'; // Importar la función desde deleteFile.js
import { compareNodosXML } from './difNodosXML.js'; // Importar la función desde uploadFile.js

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {


    // Obtener el elemento select para archivos XML y cargar las opciones disponibles
    const xmlFileSelect = document.getElementById('xmlFileSelect');
    fetchXmlFiles(xmlFileSelect); // Llama a la función para cargar opciones desde 'files.json'

    // Obtener el elemento select para archivos XML y cargar las opciones disponibles para eliminar
    const deleteFileSelect = document.getElementById('deleteFileSelect');
    fetchXmlFiles(deleteFileSelect); // Usar la misma función para llenar el select de eliminación

    // Evento para manejar el cambio de selección en el select de archivos XML
    xmlFileSelect.addEventListener('change', (event) => {
        const selectedFile = event.target.value;
        if (selectedFile) {
            // Si se selecciona un archivo, realizar una petición para obtener su contenido
            fetch(selectedFile)
                .then(response => response.text())
                .then(data => window.editor1.setValue(data)) // Establecer el contenido en xmlInput1
                .catch(error => console.error('Error fetching XML file', error));
        }
    });

    // Eventos para cargar archivos XML manualmente desde input type="file"
    document.getElementById('fileInput1').addEventListener('change', (event) => handleFileSelect(event, 1, window.editor1));
    document.getElementById('fileInput2').addEventListener('change', (event) => handleFileSelect(event, 2, window.editor2));

    // Evento para comparar XML al hacer clic en el botón 'Comparar'
    document.getElementById('compareButton').addEventListener('click', () => {
        const xmlString1 = window.editor1.getValue(); // Obtener el contenido de xmlInput1
        const xmlString2 = window.editor2.getValue(); // Obtener el contenido de xmlInput2

        const radio1Checked = document.getElementById('flexRadioDefault1').checked;
        const radio2Checked = document.getElementById('flexRadioDefault2').checked;

        const messageContainer = document.getElementById('messageContainer');

        if (radio1Checked) {
            compareDifXML(xmlString1, xmlString2); // Llamar a la función para comparar fiferencias XML
            messageContainer.innerHTML = '<p>Se seleccionó Diferencias XML.</p>';
        } else if (radio2Checked) {
            compareNodosXML(xmlString1, xmlString2); // Llamar a la función para comparar fiferencias nodos XML
            messageContainer.innerHTML = '<p>Se seleccionó Diferencias nodos XML.</p>';
        } else {
            messageContainer.innerHTML = '<p>Por favor selecciona una opción.</p>';
        }

    });

    // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
    document.getElementById('clearXmlInput1').addEventListener('click', () => {
        document.getElementById('fileInput1').value = ''; // Limpiar archivo seleccionado en fileInput1
        fetchXmlFiles(xmlFileSelect); // Llama a la función para cargar opciones desde 'files.json'
    });

    document.getElementById('clearXmlInput2').addEventListener('click', () => {
        document.getElementById('fileInput2').value = ''; // Limpiar archivo seleccionado en fileInput2
    });

    // Eventos para eliminar archivo
    document.getElementById('deleteForm').addEventListener('submit', handleDeleteFile);

});