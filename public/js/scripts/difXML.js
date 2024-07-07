// difXML.js

// Función para comparar XML y mostrar el resultado en el elemento de resultado
export function compareDifXML(xmlString1, xmlString2) {
    const diff = Diff.diffLines(xmlString1, xmlString2); // Obtener la diferencia entre los XML
    const comparisonResultElement = document.getElementById('comparisonResult');

    // Mostrar resultado de la comparación basado en si las estructuras coinciden o no
    if (diff.length === 1 && !diff[0].added && !diff[0].removed) {
        comparisonResultElement.innerHTML = '<div><span class="match">Las estructuras coinciden</span></div>';
        comparisonResultElement.style.backgroundColor = 'green';
        comparisonResultElement.style.color = 'white';
    } else {
        comparisonResultElement.innerHTML = diff2html(diff); // Convertir diff a HTML para mostrar diferencias
        comparisonResultElement.style.backgroundColor = '';
        comparisonResultElement.style.color = 'black';
    }
}

// Función para convertir diff (resultado de la comparación) en formato HTML
function diff2html(diff) {
    let html = '===================================================================<br><div>--- Base</div><div>+++ Compare</div><br>';
    diff.forEach(part => {
        const className = part.added ? 'added' : part.removed ? 'removed' : '';
        const prefix = part.added ? '+' : part.removed ? '-' : '   ';
        html += `<span class="${className}">${prefix} ${escapeHtml(part.value)}</span>`;
    });
    return html;
}

// Función para escapar caracteres HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Función para limpiar el resultado de la comparación
export function clearComparisonResult() {
    const comparisonResultElement = document.getElementById('comparisonResult');
    comparisonResultElement.innerHTML = ''; // Limpiar contenido HTML del resultado
    comparisonResultElement.style.backgroundColor = '';
    comparisonResultElement.style.color = '';
}
