// Función para inicializar CodeMirror
function initializeCodeMirror(elementId) {
    return CodeMirror.fromTextArea(document.getElementById(elementId), {
        mode: 'xml',
        theme: 'monokai', // Tema Monokai para el editor (default - eclipse - material - solarized)
        lineNumbers: true, // Habilitar números de línea
        autoCloseTags: true, // Cierre automático de etiquetas
        matchTags: { bothTags: true }, // Resaltar etiqueta coincidente
        extraKeys: { "Ctrl-Space": "autocomplete" } // Función adicional 'Ctrl-Space' activa autocompletado
    });
}

// Función para establecer el tamaño del scroll
function setScrollSize(xmlInput1, xmlInput2, size) {
    xmlInput1.getWrapperElement().style.height = `${size}px`;
    xmlInput2.getWrapperElement().style.height = `${size}px`;
}

// Función para restablecer el tamaño del scroll al valor predeterminado
function removeCustomScrollSize(xmlInput1, xmlInput2) {
    xmlInput1.getWrapperElement().style.height = '';
    xmlInput2.getWrapperElement().style.height = '';
}

// Función para manejar el cambio del switch de scroll
function handleScrollSwitchChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2) {
    scrollSwitch.addEventListener('change', () => {
        if (scrollSwitch.checked) {
            scrollSizeInput.removeAttribute('disabled');
            const value = parseInt(scrollSizeInput.value, 10);
            if (value > 0) {
                setScrollSize(xmlInput1, xmlInput2, value);
            }
        } else {
            scrollSizeInput.setAttribute('disabled', true);
            removeCustomScrollSize(xmlInput1, xmlInput2);
        }
    });
}

// Función para manejar la entrada del tamaño del scroll
function handleScrollSizeInputChange(scrollSwitch, scrollSizeInput, xmlInput1, xmlInput2) {
    scrollSizeInput.addEventListener('input', () => {
        if (scrollSwitch.checked) {
            const value = parseInt(scrollSizeInput.value, 10);
            if (value > 0) {
                setScrollSize(xmlInput1, xmlInput2, value);
            } else {
                scrollSizeInput.value = '';
            }
        }
    });
}

// Función para limpiar el resultado de la comparación
function clearComparisonResult() {
    const comparisonResultElement = document.getElementById('comparisonResult');
    comparisonResultElement.innerHTML = ''; // Limpiar contenido HTML del resultado
    comparisonResultElement.style.backgroundColor = '';
    comparisonResultElement.style.color = '';
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

// Exportar las funciones necesarias
export { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml };