import { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange } from './config.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Configuración inicial de los CodeMirror para xmlInput1 y xmlInput2
    const xmlInput1 = initializeCodeMirror("xmlInput1");
    const xmlInput2 = initializeCodeMirror("xmlInput2");

    const scrollSwitch = document.getElementById('scrollSwitch');
    const scrollSizeInput = document.getElementById('scrollSizeInput');

    handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);
    handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2);

});
