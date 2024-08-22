import { showAlert } from '../utils.js';
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml } from './config.js';
import { loadVersion } from './config.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Configuración inicial de los CodeMirror para xmlInput1 y xmlInput2
    const xmlInput1 = initializeCodeMirror("xmlInput1");
    const xmlInput2 = initializeCodeMirror("xmlInput2");

    // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
    document.getElementById('clearXmlInput1').addEventListener('click', () => {
        xmlInput1.setValue(''); // Limpiar contenido de xmlInput1
        clearComparisonResult(); // Limpiar resultado de comparación
    });

    document.getElementById('clearXmlInput2').addEventListener('click', () => {
        xmlInput2.setValue(''); // Limpiar contenido de xmlInput2
        clearComparisonResult(); // Limpiar resultado de comparación
    });


    // Obtiene elementos DOM
    const scrollSwitch = document.getElementById('scrollSwitch');
    const scrollSizeInput = document.getElementById('scrollSizeInput');

    // Maneja cambios del switch de scroll
    handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);
    // Maneja cambios del tamaño del scroll
    handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);


    // Guardar en el global scope para que sea accesible en otros scripts
    window.editor1 = xmlInput1;
    window.editor2 = xmlInput2;

    // Cargar la versión cuando se carga la página
    // window.onload = loadVersion;

});