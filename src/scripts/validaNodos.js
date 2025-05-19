import { escapeHtml } from './config.js';


export function validateNodes(xmlString1, xmlString2) {

   // Obtener la referencia del select listaTipoWebService
   const tipoWS = document.getElementById('listaTipoWebService').value;

   const validation1 = isValidXML(xmlString1);
   // Comprobamos si tipoWS tiene uno de los valores válidos y asignamos la validación correspondiente
   const validation2 = ['una-via', 'dos-vias'].includes(tipoWS)
      ? isValidXML(xmlString2) // Validación para tipo XML
      : isValidJSon(xmlString2); // Validación para tipo JSON

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

   // Parsea xml1 y xml2, invierte el orden si el radio 'flexRadioRequest' está seleccionado.
   const [xmlDoc1, xmlDoc2] = document.getElementById('flexRadioRequest').checked
      // Verifica el valor seleccionado en listaTipoWebService
      ? tipoWS === 'una-via' || tipoWS === 'dos-vias'
         ? [parser.parseFromString(xml2, 'application/xml'), parser.parseFromString(xml1, 'application/xml')] // SOAP
         : [JSON.parse(xml2), parser.parseFromString(xml1, 'application/xml')] // REST-SOAP
      : tipoWS === 'una-via-rest' || tipoWS === 'dos-vias-rest'
         ? [parser.parseFromString(xml1, 'application/xml'), JSON.parse(xml2)] // SOAP-REST
         : [parser.parseFromString(xml1, 'application/xml'), parser.parseFromString(xml2, 'application/xml')]; // SOAP

   // Extraer los nodos de ambos XML o XML-JSON
   const [nodesInfo1, nodesInfo2] = document.getElementById('flexRadioRequest').checked
      // Verifica el valor seleccionado en listaTipoWebService
      ? tipoWS === 'una-via' || tipoWS === 'dos-vias' // SOAP
         ? [extraerNodesHijos([...xmlDoc1.documentElement.children], xmlDoc1.documentElement.localName), extraerNodesHijos([...xmlDoc2.documentElement.children], xmlDoc2.documentElement.localName)] // SOAP
         : [extraerNodesHijosJson(xmlDoc1), extraerNodesHijos([...xmlDoc2.documentElement.children], xmlDoc2.documentElement.localName)] // REST
      : tipoWS === 'una-via-rest' || tipoWS === 'dos-vias-rest' // REST
         ? [extraerNodesHijos([...xmlDoc1.documentElement.children], xmlDoc1.documentElement.localName), extraerNodesHijosJson(xmlDoc2)] // REST
         : [extraerNodesHijos([...xmlDoc1.documentElement.children], xmlDoc1.documentElement.localName), extraerNodesHijos([...xmlDoc2.documentElement.children], xmlDoc2.documentElement.localName)]; // SOAP

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

// Función para validar si un JSON es válido
function isValidJSon(jsonString) {
   try {
      // Intentamos parsear la cadena a un objeto JSON
      JSON.parse(jsonString);
      // Si no hay error, la cadena es un JSON válido
      return { isValid: true, partialContent: jsonString };
   } catch (e) {
      // Si ocurre un error en el parseo, la cadena no es un JSON válido
      return { isValid: false, error: `${e.name}: ${e.message}`, partialContent: e.stack };
   }
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

/**
 * Extrae nodos hoja desde un JSON anidado, con ruta usando "." y valores.
 * @param {Object} json - Objeto JSON.
 * @returns {Array} Array de { node, url, value }
 */
function extraerNodesHijosJson(json) {
   const resultados = [];

   function recorrer(obj, ruta = []) {
      for (const clave in obj) {
         if (!Object.hasOwn(obj, clave)) continue;

         const valor = obj[clave];
         const nuevaRuta = [...ruta, clave];

         if (valor !== null && typeof valor === 'object' && !Array.isArray(valor)) {
            recorrer(valor, nuevaRuta);
         } else {
            resultados.push({
               node: clave,
               url: nuevaRuta.join('.'),
               value: valor
            });
         }
      }
   }

   recorrer(json);
   return resultados;
}

// Función para construir las cabeceras y las filas
function crearFilasYColumnas(nodesChildren, nodesChildren2, tablaContext = 'xmlTable') {
   let headers = [];

   const isRequest = document.getElementById('flexRadioRequest').checked;

   const ladoA = isRequest ? 'Cliente' : 'Banco';
   const ladoB = isRequest ? 'Banco' : 'Cliente';

   headers = [
      `Ruta Nodo ${ladoA}`,
      `Nodo ${ladoA}`,
      'Acción',
      'Resultado esperado',
      `Nodo ${ladoB}`,
      `Ruta nodo ${ladoB}`,
      `Contenido Nodo ${ladoA}`,
      `Contenido Nodo ${ladoB}`
   ];

   const rows = nodesChildren.map((nodeData, index) => {
      const opciones = ['No aplica', 'Formatear', 'Homologar', 'Asignar valor por defecto', 'Nulo'];
      
      const nodeUrl = nodeData.url;
      const nodeName = (typeof nodeData.node === 'object' && nodeData.node !== null && 'localName' in nodeData.node)
         ? nodeData.node.localName
         : nodeData.node;
      const nodeTextContent = (typeof nodeData.node === 'object' && nodeData.node !== null && 'textContent' in nodeData.node)
         ? nodeData.node.textContent
         : nodeData.value;

      const opcionesHTML = opciones.map(opcion =>
         `<option value="${opcion}" data-name="${nodeName}" data-text="${nodeTextContent}" data-url="${nodeUrl}">${opcion}</option>`
      ).join('');

      const nodeSelectOptions = `
         <option value="" disabled selected>Seleccione un nodo</option>
         ${nodesChildren2.map(child => {
         const isXmlNode = typeof child.node === 'object' && child.node !== null && 'localName' in child.node;

         const localName = isXmlNode ? child.node.localName : child.node;
         const text = isXmlNode ? child.node.textContent : child.value || child.node;

         return `
               <option value="${child.url}" data-name="${localName}" data-text="${text}" data-url="${child.url}">
                  ${localName}
               </option>`;
      }).join('')}
         <option class="${isRequest ? 'd-none' : 'd-flex'}" value="request-inicial" data-text="Dato del request inicial">Dato del request inicial</option>
         <option value="sin-referencia" data-text="Sin referencia">Sin referencia</option>
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