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

// Función para verificar si el servidor está disponible
async function checkServerStatus(url, retries = 2, delay = 20000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return true; // Servidor disponible
            }
        } catch (error) {
            // Ignorar error y reintentar
        }
        await new Promise(resolve => setTimeout(resolve, delay)); // Esperar antes de reintentar
    }
    return false; // Servidor no disponible después de los reintentos
}

// Función para obtener la versión de la API y actualizar el span
async function loadVersion() {

    let serverUrl;

    // Detectar el entorno
    const hostname = window.location.hostname;
    
    if (hostname === '127.0.0.1') {
        // Entorno local
        serverUrl = 'http://localhost:3000/version';
    } else if (hostname === 'xml-comparer-tool-prueba.vercel.app') {
        // Entorno de desarrollo en Vercel
        serverUrl = 'https://xml-comparer-tool-prueba.vercel.app/version';
    } else if (hostname === 'xml-comparer-tool.vercel.app') {
        // Entorno de producción
        serverUrl = 'https://xml-comparer-tool.vercel.app/version';
    } else {
        // URL por defecto en caso de que no coincida con ninguno de los casos anteriores
        serverUrl = 'https://xml-comparer-tool.vercel.app/version';
    }

    // Verifica si el servidor está disponible
    const isServerUp = await checkServerStatus(serverUrl);

    if (isServerUp) {
        try {
            const response = await fetch(serverUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            document.getElementById('app-version').textContent = data.version;
        } catch (error) {
            console.error('Error al cargar la versión:', error.message);
            document.getElementById('app-version').textContent = 'Error al cargar versión';
        }
    } else {
        console.error('Servidor no disponible.');
        document.getElementById('app-version').textContent = 'Servidor no disponible';
    }
}

// Exportar las funciones necesarias
export { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml, loadVersion };