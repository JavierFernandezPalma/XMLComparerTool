import { showAlert } from '../utils.js';
import { fetchXmlFiles } from './readFiles.js'; // Importar la función desde readFiles.js
import { handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml, loadVersion, customIcon } from './config.js';
// import { formatXML } from '@scripts/formatXML.js';
import { formatXML } from './formatXML.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    const customElement1 = document.getElementById('textarea1');
    const customElement2 = document.getElementById('textarea2');

    let xmlInput1;
    let xmlInput2;

    // 🔒 Espera a que el editor esté listo
    customElement1.addEventListener('codemirror-ready', (e) => {
        // Configuración inicial del CodeMirror para xmlInput1
        xmlInput1 = customElement1.getCodeMirrorInstance();
    });

    // 🔒 Espera a que el editor 2 esté listo
    customElement2.addEventListener('codemirror-ready', (e) => {
        // Configuración inicial del CodeMirror para xmlInput2
        xmlInput2 = customElement2.getCodeMirrorInstance();

        // Obtiene elementos DOM
        const scrollSwitch = document.getElementById('scrollSwitch');
        const scrollSizeInput = document.getElementById('scrollSizeInput');

        // Maneja cambios del switch de scroll
        handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);
        // Maneja cambios del tamaño del scroll
        handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);
    });

    // Crea un contenedor para íconos SVG personalizados y los agrega al DOM.
    customIcon();

    formatXML("textarea1", "textarea2");

    // Cargar la versión cuando se carga la página
    window.onload = loadVersion;

});