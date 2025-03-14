import xml2js from 'xml2js';
import { escapeHtml } from './scripts/config.js';

// Función para parsear un XML genérico, incluyendo atributos y arrays
export function parseXMLToTable(xmlString) {

    // Verificar si los XML son válidos antes de parsearlos
    const validation1 = isValidXML(xmlString);
    if (!validation1.isValid) {
        displayResult(`<div class="error"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>XML 1 tiene errores de sintaxis: ${validation1.error}<br></div><div><pre>${escapeHtml(validation1.partialContent)}</pre></div>`);
        return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const rows = [];
    const headers = new Set();  // Usamos un Set para asegurar que los encabezados sean únicos

    // Función recursiva para extraer los datos y crear las filas
    function extractData(node, row = {}, parentNodeName = '') {
        // Si el nodo tiene atributos, agregar estos atributos como columnas
        if (node.attributes) {
            for (let attr of node.attributes) {
                const attrName = `${parentNodeName}_${attr.name}`; // Combine el nombre del nodo con el nombre del atributo
                row[attrName] = attr.value;
                headers.add(attrName); // Agregar la columna con el atributo al Set
            }
        }

        // Recorrer los hijos del nodo
        for (let child of node.children) {
            const nodeName = child.nodeName;
            if (child.children.length > 0) {
                // Si tiene hijos, lo tratamos recursivamente
                extractData(child, row, nodeName);
            } else {
                // Si no tiene hijos, agregamos el valor al objeto row
                row[nodeName] = child.textContent;
                headers.add(nodeName); // Agregamos el nombre del nodo al set de encabezados
            }
        }
        return row;
    }

    // Extraer los datos de cada elemento <Certificate> dentro de <Certificates>
    const certificates = xmlDoc.getElementsByTagName("Certificate");
    for (let certificate of certificates) {
        const row = extractData(certificate, {}, certificate.nodeName);

        // Obtener CryptoCertificates y convertirlos a formato JSON
        const cryptoCertificates = certificate.getElementsByTagName("CryptoCertificate");
        const cryptoData = [];
        for (let crypto of cryptoCertificates) {
            const cryptoInfo = {};
            for (let attr of crypto.attributes) {
                cryptoInfo[attr.name] = attr.value;
            }
            cryptoData.push(cryptoInfo);
        }

        // Añadir la columna de CryptoCertificates en formato JSON
        row["CryptoCertificate"] = JSON.stringify(cryptoData);

        rows.push(row);
    }

    // Crear los encabezados de la tabla
    const headerRow = Array.from(headers).map(header => `<th>${header}</th>`).join('');
    let tableHeaders = document.getElementById('tableHeaders');
    if (!tableHeaders) {
        // Crear el elemento <thead> si no existe
        tableHeaders = document.createElement('thead');
        tableHeaders.id = 'tableHeaders';
        // Suponemos que la tabla ya existe, por lo que agregamos el thead creado a la tabla
        document.getElementById('xmlTable').appendChild(tableHeaders);
    }
    tableHeaders.innerHTML = headerRow; // Asignar el contenido de los encabezados

    let expirationDate = '';
    // Crear las filas de la tabla
    const tableBody = rows.map(row => {
        return `<tr>${Array.from(headers).map(header => {
            // Asegurar que cada celda tenga el valor adecuado, incluso si está vacío
            const cellData = row[header] || '';
            if (header === "ExpirationDate") {
                // Convertir la fecha de entrada (en formato ISO 8601) a un objeto Date
                expirationDate = new Date(cellData);
            }
            // Asegurar que CryptoCertificates se muestre como JSON de forma legible
            if (header === "Base64") {
                // Crear un botón "Descargar" en la columna Base64
                return `<td><button onclick="downloadCerFile('${cellData}')">Descargar</button></td>`;
            } else if (header === "DaysToExpire") {
                // Calcular y mostrar los días restantes hasta la expiración
                const diasParaExpirar = restarFechas(expirationDate);
                // Verificar si diasParaExpirar es un valor válido (número y no NaN)
                return `<td>${!isNaN(diasParaExpirar) ? diasParaExpirar : cellData}</td>`;
            } else {
                return `<td>${header === 'CryptoCertificates' ? `<pre>${cellData}</pre>` : cellData}</td>`;
            }
        }).join('')}</tr>`;
    }).join('');

    let tableBodyElement = document.getElementById('tableBody');
    if (!tableBodyElement) {
        // Crear el elemento <tbody> si no existe
        tableBodyElement = document.createElement('tbody');
        tableBodyElement.id = 'tableBody';
        // Suponemos que la tabla ya existe, por lo que agregamos el tbody creado a la tabla
        document.getElementById('xmlTable').appendChild(tableBodyElement);
    }
    tableBodyElement.innerHTML = tableBody; // Asignar el contenido de las filas
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

// Función para extraer todo lo que esté después de </parsererror>
function extractContentAfterParserError(xmlString) {
    // Encontrar la posición del cierre de la etiqueta </parsererror>
    const parserErrorEndIndex = xmlString.indexOf('</parsererror>');
    
    // Si no se encuentra la etiqueta </parsererror>, devolvemos una cadena vacía
    if (parserErrorEndIndex === -1) {
        return '';
    }

    // Extraemos todo lo que está después de </parsererror>
    return xmlString.substring(parserErrorEndIndex + '</parsererror>'.length).trim();
}

// Función para exportar la tabla a formato Excel
function exportToExcel() {
    const table = document.getElementById("xmlTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "tabla_certificados.xlsx");
}

// Función para mostrar el resultado en el DOM
function displayResult(result) {
    const comparisonResultElement = document.getElementById('comparisonResult');
    comparisonResultElement.innerHTML = result; // Convertir result a HTML para mostrar diferencias
    comparisonResultElement.style.color = 'black';
    comparisonResultElement.style.fontSize = '100%';
}

// Función para restar la fecha actual de una fecha específica y devolver la diferencia en días
function restarFechas(fechaFutura) {
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular la diferencia en milisegundos
    const diferenciaMs = fechaFutura - fechaActual;

    // Convertir la diferencia en días (1 día = 24 horas = 86,400,000 milisegundos)
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    // Devolver la diferencia en días como un número
    return diferenciaDias;
}

// Exportar a Excel al hacer clic en el botón
document.getElementById('exportToExcel').addEventListener('click', function () {
    exportToExcel();
});














