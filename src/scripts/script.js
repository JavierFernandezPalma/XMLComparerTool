import { showAlert } from '../utils.js';
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml, loadVersion, customIcon } from './config.js';
// import { formatXML } from '@scripts/formatXML.js';
import { formatXML } from './formatXML.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    const customElement1 = document.getElementById('textarea1');
    const customElement2 = document.getElementById('textarea2');

    // Configuración inicial de los CodeMirror para xmlInput1 y xmlInput2
    const xmlInput1 = customElement1.getCodeMirrorInstance();
    const xmlInput2 = customElement2.getCodeMirrorInstance();

    // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
    customElement1.shadowRoot.getElementById('clearXmlInput1').addEventListener('click', () => {
        xmlInput1.setValue(''); // Limpiar contenido de xmlInput1
        clearComparisonResult(); // Limpiar resultado de comparación
    });

    customElement2.shadowRoot.getElementById('clearXmlInput2').addEventListener('click', () => {
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

    // Crea un contenedor para íconos SVG personalizados y los agrega al DOM.
    customIcon();

    formatXML("textarea1", "textarea2");

    // Cargar la versión cuando se carga la página
    window.onload = loadVersion;

});