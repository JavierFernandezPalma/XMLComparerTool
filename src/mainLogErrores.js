import { loadVersion } from '@scripts/config.js';
import "./components/modal-xml";
import '@styles/main.css';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Cargar la versión cuando se carga la página
    window.onload = loadVersion;

});