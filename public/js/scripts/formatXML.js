// Obtener los botones Aplicar Formato
var formatXmlInput1 = document.getElementById('formatXmlInput1');
var formatXmlInput2 = document.getElementById('formatXmlInput2');

// Agregar eventos click a los botones
formatXmlInput1.addEventListener('click', function () {
    formatXmlEditor(window.editor1);
});

formatXmlInput2.addEventListener('click', function () {
    formatXmlEditor(window.editor2);
});

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