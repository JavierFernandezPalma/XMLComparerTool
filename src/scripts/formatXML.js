function formatXML(componentId1, componentId2) {
    const customElement1 = document.getElementById(componentId1);
    const customElement2 = document.getElementById(componentId2);

    // Agregar eventos click a los botones
    if (customElement1) {
        // Obtener boton Aplicar Formato
        var formatXmlInput1 = customElement1.shadowRoot.getElementById('formatXmlInput1');
        formatXmlInput1.addEventListener('click', () => {
            const mode = customElement1.shadowRoot.getElementById('modeSelectorSelect')?.value;
            (mode === 'xml' ? formatXmlEditor : formatJsonEditor)(window.editor1);
        });
    }
    if (customElement2) {
        // Obtener boton Aplicar Formato
        var formatXmlInput2 = customElement2.shadowRoot.getElementById('formatXmlInput2');
        formatXmlInput2.addEventListener('click', () => {
            const mode = customElement2.shadowRoot.getElementById('modeSelectorSelect')?.value;
            (mode === 'xml' ? formatXmlEditor : formatJsonEditor)(window.editor2);
        });
    }
}
// Función para aplicar formato al XML en un editor específico
function formatXmlEditor(editor) {
    // Obtener el contenido del editor
    var xml = editor.getValue().trim();  // Obtener y recortar el contenido

    // Asegurar que la declaración XML sea tratada correctamente
    xml = xml.replace(/<\?xml/, "<xml").replace(/\?>/g, ">XML</xml>");

    // Validar que haya contenido en xml
    if (xml.length > 0) {
        // Crear un parser XML
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml, 'application/xml');

        // Aplicar formato al XML del editor
        var formattedXml = formatXml(xmlDoc);

        // Actualizar el contenido del editor con el XML formateado
        editor.setValue(formattedXml);
    }
}

// Función para aplicar formato al XML
function formatXml(xml) {
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xml);

    // Indentación del XML
    var formattedXml = '';
    var indentLevel = 0;

    // Dividir el XML en nodos individuales usando una expresión regular
    var nodes = xmlString.split(/>\s*</);

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        // Manejar las secciones CDATA
        if (node.includes('![CDATA[')) {
            formattedXml += '\t'.repeat(indentLevel) + '<' + node + '>\n';
            continue;
        }

        // Si el nodo es una etiqueta de cierre, reducir la indentación
        if (node.match(/^\/\w/)) {
            indentLevel--;
        }

        // Añadir la indentación y el nodo al XML formateado
        if (indentLevel < 0) indentLevel = 0;
        formattedXml += '\t'.repeat(indentLevel) + '<' + node + '>\n';

        // Si el nodo es una etiqueta de apertura y no es una etiqueta auto-cerrada, incrementar la indentación
        if (node.match(/^<?\w[^>]*[^\/]$/) && !node.match(/<\?.*\?>/)) {
            indentLevel++;
        }
    }

    // Asegurar que la declaración XML sea tratada correctamente
    formattedXml = formattedXml.replace(/<\xml/, "<?xml").replace(/>XML<\/xml>/g, '?>').replace('<<', '<').replace('>>', '>').trim();

    // Devolver el XML formateado
    return formattedXml;
}

/**
 * Formatea el contenido JSON de un editor.
 * - Intenta parsear una o dos veces (por si viene como string doble)
 * - Reasigna el valor formateado al editor
 * @param {object} editor - Objeto con métodos getValue y setValue
 */
function formatJsonEditor(editor) {
    let json = editor.getValue().trim();
    try {
        let parsed = JSON.parse(json);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        editor.setValue(JSON.stringify(parsed, null, 2));
    } catch (e) {
        // Manejo opcional de errores, según sea necesario
        alert("Error en la estructura json: " + e.message); // ✅ alert solo acepta un string
    }
}

// Exportar las funciones necesarias
export { formatXML };