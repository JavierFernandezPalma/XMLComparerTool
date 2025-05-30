import { showAlert } from '../utils.js';
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { compareDifXML } from './difXML.js'; // Importar funciones desde diffXML.js
import { loadDeleteXMLTemplate, loadUploadXMLTemplate } from './indexDinamico.js';
import { handleFileSelect } from './uploadFile.js'; // Importar la función desde uploadFile.js
import { handleDeleteFile } from './deleteFile.js'; // Importar la función desde deleteFile.js
import { compareNodosXML } from './difNodosXML.js'; // Importar la función desde uploadFile.js
import { clearComparisonResult } from './config.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    const customElement1 = document.getElementById('textarea1');
    const customElement2 = document.getElementById('textarea2');

    // Obtiene la URL actual
    const currentUrl = window.location.href;

    // Define la URL base para la comparación
    const baseUrl = "http://localhost:3000/index.html?configure=true";

    // Verifica si la URL actual comienza con la URL base
    if (currentUrl.startsWith(baseUrl)) {

        alert("Estás en el modo configuración!");

        // contenido de index.html dinámico
        loadDeleteXMLTemplate();
        loadUploadXMLTemplate();
    }

    // Obtener el elemento select para archivos XML y cargar las opciones disponibles
    const xmlFileSelect = document.getElementById('xmlFileSelect');
    // Manipular los elementos solo si existen en el DOM
    if (xmlFileSelect) {
        fetchXmlFiles(xmlFileSelect); // Llama a la función para cargar opciones desde 'files.json'
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
    }

    // Obtener el elemento select para archivos XML y cargar las opciones disponibles para eliminar
    const deleteFileSelect = document.getElementById('deleteFileSelect');
    if (deleteFileSelect) {
        fetchXmlFiles(deleteFileSelect); // Usar la misma función para llenar el select de eliminación
    }

    // Eventos para cargar archivos XML manualmente desde input type="file"
    document.getElementById('fileInput1').addEventListener('change', (event) => handleFileSelect(event, 1, window.editor1));
    document.getElementById('fileInput2').addEventListener('change', (event) => handleFileSelect(event, 2, window.editor2));

    // Verificar si el botón con id 'compareButton' existe en el DOM
    const compareButton = document.getElementById('compareButton');
    if (compareButton) {
        // Evento para comparar XML al hacer clic en el botón 'Comparar'
        compareButton.addEventListener('click', () => {
            const xmlString1 = window.editor1.getValue(); // Obtener el contenido de xmlInput1
            const xmlString2 = window.editor2.getValue(); // Obtener el contenido de xmlInput2

            const radio1Checked = document.getElementById('flexRadioDefault1').checked;
            const radio2Checked = document.getElementById('flexRadioDefault2').checked;

            const messageContainer = document.getElementById('messageContainer');

            if (radio1Checked) {
                clearComparisonResult(); // Limpiar resultado de comparación
                compareDifXML(xmlString1, xmlString2); // Llamar a la función para comparar diferencias XML
                messageContainer.innerHTML = '<p>Se seleccionó Diferencias XML.</p>';
            } else if (radio2Checked) {
                clearComparisonResult(); // Limpiar resultado de comparación
                compareNodosXML(xmlString1, xmlString2); // Llamar a la función para comparar diferencias nodos XML
                messageContainer.innerHTML = '<p>Se seleccionó Diferencias nodos XML.</p>';
            } else {
                messageContainer.innerHTML = '<p>Por favor selecciona una opción.</p>';
            }
        });
    } else {
        console.log('El botón "Comparar" no existe en el DOM.');
    }

    var clearXmlInput1 = customElement1.shadowRoot.getElementById('clearXmlInput1');
    if (clearXmlInput1) {
        // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
        customElement1.shadowRoot.getElementById('clearXmlInput1').addEventListener('click', () => {
            document.getElementById('fileInput1').value = ''; // Limpiar archivo seleccionado en fileInput1
            fetchXmlFiles(xmlFileSelect); // Llama a la función para cargar opciones desde 'files.json'
        });
    } else {
        console.error('Elemento clearXmlInput1 no encontrado');
    }
    var clearXmlInput2 = customElement2.shadowRoot.getElementById('clearXmlInput2');
    if (clearXmlInput2) {
        customElement2.shadowRoot.getElementById('clearXmlInput2').addEventListener('click', () => {
            document.getElementById('fileInput2').value = ''; // Limpiar archivo seleccionado en fileInput2
        });
    } else {
        console.error('Elemento clearXmlInput2 no encontrado');
    }

    // Eventos para eliminar archivo
    const deleteForm = document.getElementById('deleteForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', handleDeleteFile);
    } else {
        // console.error('Elemento deleteForm no encontrado');
    }

});