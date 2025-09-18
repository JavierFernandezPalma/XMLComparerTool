import { parseXMLToTable } from '../parser.js';
import { handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult } from '@scripts/config.js';
import { loadVersion } from '@scripts/config.js';
import { handleFileSelect } from '@scripts/uploadFile.js'; // Importar la función desde uploadFile.js
import { formatXML } from '@scripts/formatXML.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

  const customElement = document.getElementById('textarea1');

  let xmlInput1;

  // 🔒 Espera a que el editor esté listo
  customElement.addEventListener('codemirror-ready', (e) => {
    // Configuración inicial del CodeMirror para xmlInput1
    xmlInput1 = customElement.getCodeMirrorInstance();

    // Obtiene elementos DOM
    const scrollSwitch = document.getElementById('scrollSwitch');
    const scrollSizeInput = document.getElementById('scrollSizeInput');

    // Maneja cambios del switch de scroll
    handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput1);
    // Maneja cambios del tamaño del scroll
    handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput1);
  });


  // Guardar en el global scope para que sea accesible en otros scripts
  window.editor1 = xmlInput1;

  // Cargar la versión cuando se carga la página
  window.onload = loadVersion;

  // Eventos para cargar archivos XML manualmente desde input type="file"
  document.getElementById('fileInput1').addEventListener('change', (event) => handleFileSelect(event, 1, window.editor1));

  var clearXmlInput1 = customElement.shadowRoot.getElementById('clearXmlInput1');
  if (clearXmlInput1) {
    // Eventos para limpiar el contenido de xmlInput1 y xmlInput2 y el resultado de la comparación
    customElement.shadowRoot.getElementById('clearXmlInput1').addEventListener('click', () => {
      document.getElementById('fileInput1').value = ''; // Limpiar archivo seleccionado en fileInput1
      xmlInput1.setValue(''); // Limpiar contenido de xmlInput1
      clearComparisonResult(); // Limpiar resultado de comparación
    });
  } else {
    console.error('Elemento clearXmlInput1 no encontrado');
  }

  formatXML("textarea1", null);
});

// Mostrar la tabla al hacer clic en el botón
document.getElementById('showTableButton').addEventListener('click', function () {
  clearComparisonResult(); // Limpiar resultado de comparación
  const xmlData = window.editor1.getValue();
  // parseXMLToTable(xmlData, (err, result) => {
  //   const outputDiv = document.getElementById('output');

  //   if (err) {
  //     alert("Entró If")
  //     outputDiv.textContent = err;
  //   } else {
  //     outputDiv.textContent = result;
  //     // Mostrar la tabla y activar DataTables
  //     $('#xmlTable').show();
  //     $('#xmlTable').DataTable({
  //       "autoWidth": true,   // Ajuste automático ancho columnas
  //       "paging": true,      // Habilitar paginación
  //       "processing": true,  // Indicador de carga
  //       "scrollX": true,
  //       // "scrollY": 200,
  //       "dom": 'Bfrtip',
  //       "buttons": [
  //         'copy',
  //         'pdf',
  //         'csv',
  //         'excel',
  //         'print',
  //         'pageLength',
  //         'colvis'
  //       ]
  //     });

  //     // Mostrar el botón de exportar
  //     document.getElementById('exportToExcel').style.display = 'inline-block';
  //   }
  // });

  // Verificar si la tabla ya ha sido inicializada
  if ($.fn.dataTable.isDataTable('#xmlTable')) {
    // Si está inicializada, destruir la instancia de DataTable
    $('#xmlTable').DataTable().destroy();
    $('#xmlTable').empty(); // Vaciar la tabla para poder volver a llenarla con nuevos datos
  }

  parseXMLToTable(xmlData);

  // Mostrar la tabla y activar DataTables
  $('#xmlTable').show();
  $('#xmlTable').DataTable({
    "autoWidth": true,   // Ajuste automático ancho columnas
    "paging": true,      // Habilitar paginación
    "processing": true,  // Indicador de carga
    "scrollX": true,
    // "scrollY": 200,
    "dom": 'Bfrtip',
    "buttons": [
      'copy',
      'pdf',
      'csv',
      // 'excel',
      'print',
      'pageLength',
      'colvis'
    ]
  });

  // Mostrar el botón de exportar
  document.getElementById('exportToExcel').style.display = 'inline-block';
});