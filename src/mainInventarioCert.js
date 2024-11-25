import { procesarXML } from './parser.js';
import { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml } from './scripts/config.js';
// import '@styles/main.css'

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

  // Configuración inicial de los CodeMirror para xmlInput1 y xmlInput2
  const xmlInput = initializeCodeMirror("xmlInput");

  // Guardar en el global scope para que sea accesible en otros scripts
  window.editor = xmlInput;

});

// Evento para parsear certificados
const parseBtn = document.getElementById('parseBtn');
if (parseBtn) {
  document.getElementById('parseBtn').addEventListener('click', () => {
    const xmlInput = window.editor.getValue();

    procesarXML(xmlInput, (err, result) => {
      const outputDiv = document.getElementById('output');

      if (err) {
        outputDiv.textContent = err;
      } else {
        outputDiv.textContent = result;
      }
    });
  });
} else {
  console.error('Elemento parseBtn no encontrado');
}