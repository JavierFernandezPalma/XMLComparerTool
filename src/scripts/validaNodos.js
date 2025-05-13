import { escapeHtml } from './config.js';


export function validateNodes(xmlString1, xmlString2) {

   const validation1 = isValidXML(xmlString1);
   const validation2 = isValidXML(xmlString2);

   if (!validation1.isValid || !validation2.isValid) {
      const errorMsg = !validation1.isValid ? validation1 : validation2;
      displayResult(`<div class="error"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>${errorMsg === validation1 ? 'XML 1' : 'XML 2'} tiene errores de sintaxis: ${errorMsg.error}<br></div><div><pre>${escapeHtml(errorMsg.partialContent)}</pre></div>`);
      return { headers: [], rows: [] };
   }


   const parser = new DOMParser();
   const preprocess = str => preprocessXML(str.replace(/\s*(<[^>]+>)\s*/g, '$1').trim());

   // Obtener los valores de los editores CodeMirror
   const xml1 = preprocess(xmlString1);
   const xml2 = preprocess(xmlString2);


   const [xmlDoc1, xmlDoc2] = document.getElementById('flexRadioRequest').checked
      ? [parser.parseFromString(xml2, 'application/xml'), parser.parseFromString(xml1, 'application/xml')]
      : [parser.parseFromString(xml1, 'application/xml'), parser.parseFromString(xml2, 'application/xml')];

   // Extraer los nodos de ambos XML
   const nodesInfo1 = extraerNodesHijos([...xmlDoc1.documentElement.children], xmlDoc1.documentElement.localName);
   const nodesInfo2 = extraerNodesHijos([...xmlDoc2.documentElement.children], xmlDoc2.documentElement.localName);

   const radios = document.querySelectorAll('input[name="tipoMapeo"]');
   // Buscar el radio actualmente seleccionado para colocar el tipo de mapeo en el nombre del Modal
   const seleccionado = Array.from(radios).find(radio => radio.checked);

   // Crear los encabezados y las filas dinámicamente
   const metodoWebService = document.getElementById('metodoWebService');
   let tablaContext = '';
   // Determinar el contexto de la tabla según el método del web service
   switch (metodoWebService.value + seleccionado.value) {
      case 'VerificarEstadoWebServiceRequest':
         tablaContext = 'xmlTable';
         break;
      case 'ConsultaFacturaPorNumeroRequest':
         tablaContext = 'xmlTable2';
         break;
      case 'RegistrarPagoIFXRequest':
         tablaContext = 'xmlTable3';
         break;
      case 'ConsultaFacturaPorNumeroIFX':
         tablaContext = 'xmlTable4';
         break;
      case 'ConsultaFacturaPorNumeroIFX2':
         tablaContext = 'xmlTable5';
         break;
      case 'VerificarEstadoWebServiceResponse':
         tablaContext = 'xmlTable6';
         break;
      case 'ConsultaFacturaPorNumeroResponse':
         tablaContext = 'xmlTable7';
         break;
      case 'RegistrarPagoIFXResponse':
         tablaContext = 'xmlTable8';
         break;
      default:
         tablaContext = 'xmlTable';
         break;
   }
   // Crear cabeceras y filas
   const { headers, rows } = crearFilasYColumnas(nodesInfo1, nodesInfo2, tablaContext);

   // const table = document.getElementById('xmlTable');

   // const headerHtml = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
   // let thead = document.getElementById('tableHeaders');
   // if (!thead) {
   //    thead = document.createElement('thead');
   //    thead.id = 'tableHeaders';
   //    table.appendChild(thead);
   // }
   // thead.innerHTML = headerHtml;

   // // Crear cuerpo de la tabla
   // let tableHtml = '';
   // rows.forEach((row, rowIndex) => {
   //    tableHtml += '<tr>';
   //    row.forEach((cell, cellIndex) => {
   //       if (cell.includes('<select')) {
   //          tableHtml += `<td class="columna-select" id="cell-${rowIndex}-${cellIndex}">${cell}</td>`;
   //       } else if (cell.includes('<input')) {
   //          tableHtml += `<td class="columna-text" id="cell-${rowIndex}-${cellIndex}">${cell}</td>`;
   //       } else if (cell.includes('<span')) {
   //          tableHtml += `<td class="columna-span" id="cell-${rowIndex}-${cellIndex}">${cell}</td>`;
   //       } else {
   //          tableHtml += `<td id="cell-${rowIndex}-${cellIndex}">${cell}</td>`;
   //       }
   //    });
   //    tableHtml += '</tr>';
   // });

   // let tbody = document.getElementById('tableBody');
   // if (!tbody) {
   //    tbody = document.createElement('tbody');
   //    tbody.id = 'tableBody';
   //    table.appendChild(tbody);
   // }
   // tbody.innerHTML = tableHtml;

   return { headers, rows };
}

// Función para preprocesar el XML eliminando CDATA y declaraciones XML
function preprocessXML(xmlString) {
   return xmlString.replace('![CDATA[', "CDATA>").replace(']]', "</CDATA").replace(/<\?xml[^>]*\?>/g, "").trim();
}

// Función para validar si un XML es válido
function isValidXML(xmlString) {
   const parser = new DOMParser();
   const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
   const parserError = xmlDoc.querySelector('parsererror');
   if (parserError) {
      // Capturar la parte del XML que se puede procesar hasta el primer error
      const partialContent = getPartialContentUntilError(xmlString, parserError.textContent);
      // Capturar la parte del XML que muestra la corrección del error
      // const closingTag = extractContentAfterParserError(xmlDoc);
      return { isValid: false, error: parserError.textContent, partialContent: partialContent };
   }
   return { isValid: true, partialContent: xmlString };
}

// Función para obtener el contenido parcial del XML hasta el primer error
function getPartialContentUntilError(xmlString, errorMessage) {
   const lines = xmlString.split('\n');
   const errorLineMatch = errorMessage.match(/error on line (\d+)/);
   if (errorLineMatch) {
      const errorLine = parseInt(errorLineMatch[1], 10);
      return lines.slice(0, errorLine).join('\n');
   }
   return xmlString;
}

// Función para mostrar el resultado en el DOM
function displayResult(result) {
   const comparisonResultElement = document.getElementById('comparisonResult');
   comparisonResultElement.innerHTML = result; // Convertir result a HTML para mostrar diferencias
   comparisonResultElement.style.color = 'black';
   comparisonResultElement.style.fontSize = '100%';
}


// Función recursiva para extraer nodos hijos y sus rutas completas
function extraerNodesHijos(nodes, currentPath = '') {
   let result = []; // Inicializa el array de nodos hijos

   nodes.forEach(child => {
      const childName = child.localName;
      const newPath = `${currentPath}/${childName}`;

      // Si el nodo tiene hijos, se llama recursivamente
      if (child.children.length > 0) {
         result = result.concat(extraerNodesHijos([...child.children], newPath)); // Recursión y concatenación de resultados
      } else {
         // Guardar la ruta y el nodo hijo
         result.push({ node: child, url: newPath });
      }
   });

   return result; // Retorna el array con los nodos hijos
}



// Función para construir las cabeceras y las filas
function crearFilasYColumnas(nodesChildren, nodesChildren2, tablaContext = 'xmlTable') {
   let headers = [];

   if (document.getElementById('flexRadioRequest').checked) {
      headers = [
         'Url Nodo Cliente',
         'Nodo Cliente',
         'Acción',
         'Resultado esperado',
         'Nodo Banco',
         'Url nodo Banco',
         'Contenido Nodo Cliente',
         'Contenido Nodo Banco'
      ];
   } else if (document.getElementById('flexRadioResponse').checked) {
      headers = [
         'Url Nodo Banco',
         'Nodo Banco',
         'Acción',
         'Resultado esperado',
         'Nodo Cliente',
         'Url nodo Cliente',
         'Contenido Nodo Banco',
         'Contenido Nodo Cliente'
      ];
   }

   const rows = nodesChildren.map((nodeData, index) => {
      const opciones = ['No aplica', 'Formatear', 'Homologar', 'Asignar valor por defecto', 'Nulo'];
      const nodeUrl = nodeData.url;
      const nodeName = nodeData.node.localName;
      const nodeTextContent = nodeData.node.textContent;

      const opcionesHTML = opciones.map(opcion =>
         `<option value="${opcion}" data-name="${nodeName}" data-text="${nodeTextContent}" data-url="${nodeUrl}">${opcion}</option>`
      ).join('');

      const nodeSelectOptions = `
         <option value="" disabled selected>Seleccione un nodo</option>
         ${nodesChildren2.map(child => `
            <option value="${child.url}" data-name="${child.node.localName}" data-text="${child.node.textContent}">
               ${child.node.localName}
            </option>`).join('')}
         <option value="Sin referencia" data-text="Sin referencia">Sin referencia</option>
      `;

      // Agregamos prefijo único al ID del select
      const selectAccionId = `${tablaContext}-list1_${index}`;
      const selectNodoId = `${tablaContext}-node-select-${index}`;

      return [
         nodeUrl,
         nodeName,
         `<select id="${selectAccionId}" onchange="actualizarAccionSeleccionada(this, ${index}, '${tablaContext}')" disabled>${opcionesHTML}</select>`,
         `<span id="${tablaContext}-fourth-column-${index}"></span>`,
         `<select onchange="actualizarUrlSeleccionado(this, ${index}, '${tablaContext}')" id="${selectNodoId}">${nodeSelectOptions}</select>`,
         `<span id="${tablaContext}-result3_${index}"></span>`,
         nodeTextContent,
         `<span id="${tablaContext}-eighth-column-${index}"></span>`
      ];
   });

   return { headers, rows };
}