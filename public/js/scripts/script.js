import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { compareDifXML, clearComparisonResult } from './difXML.js'; // Importar funciones desde diffXML.js
import { handleDeleteFile } from './deleteFile.js'; // Importar la función desde deleteFile.js
import { handleFileSelect } from './uploadFile.js'; // Importar la función desde uploadFile.js
import { compareNodosXML } from './difNodosXML.js'; // Importar la función desde uploadFile.js
import { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange } from './config.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Configuración inicial de los CodeMirror para xmlInput1 y xmlInput2
    const xmlInput1 = initializeCodeMirror("xmlInput1");
    const xmlInput2 = initializeCodeMirror("xmlInput2");

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
                .then(data => xmlInput1.setValue(data)) // Establecer el contenido en xmlInput1
                .catch(error => console.error('Error fetching XML file', error));
        }
    });

    // Eventos para cargar archivos XML manualmente desde input type="file"
    document.getElementById('fileInput1').addEventListener('change', (event) => handleFileSelect(event, 1, xmlInput1));
    document.getElementById('fileInput2').addEventListener('change', (event) => handleFileSelect(event, 2, xmlInput2));

    // Evento para comparar XML al hacer clic en el botón 'Comparar'
    document.getElementById('compareButton').addEventListener('click', () => {
        const xmlString1 = xmlInput1.getValue(); // Obtener el contenido de xmlInput1
        const xmlString2 = xmlInput2.getValue(); // Obtener el contenido de xmlInput2

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
        xmlInput1.setValue(''); // Limpiar contenido de xmlInput1
        clearComparisonResult(); // Limpiar resultado de comparación
    });

    document.getElementById('clearXmlInput2').addEventListener('click', () => {
        xmlInput2.setValue(''); // Limpiar contenido de xmlInput2
        clearComparisonResult(); // Limpiar resultado de comparación
    });

    document.getElementById('deleteForm').addEventListener('submit', handleDeleteFile);

    
    const scrollSwitch = document.getElementById('scrollSwitch');
    const scrollSizeInput = document.getElementById('scrollSizeInput');

    // Maneja cambios del switch de scroll
    handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);
    // Maneja cambios del tamaño del scroll
    handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);


    // Guardar en el global scope para que sea accesible en otros scripts
    window.editor1 = xmlInput1;
    window.editor2 = xmlInput2;

});
