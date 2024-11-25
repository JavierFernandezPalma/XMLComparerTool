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
    if (comparisonResultElement) {
        comparisonResultElement.innerHTML = ''; // Limpiar contenido HTML del resultado
        comparisonResultElement.style.backgroundColor = '';
        comparisonResultElement.style.color = '';
    }
    const validatioResultElement = document.getElementById('validationResult');
    if (validatioResultElement) {
        validatioResultElement.innerHTML = ''; // Limpiar contenido HTML del resultado
        validatioResultElement.style.backgroundColor = '';
        validatioResultElement.style.color = '';
    }
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
        serverUrl = 'https://xmlcomparertool.onrender.com/version';
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

/**
 * Crea un contenedor para íconos SVG personalizados y los agrega al DOM.
 *
 * La función `customicon` realiza las siguientes acciones:
 * 1. Crea un elemento `<div>` que contendrá los íconos SVG.
 * 2. Inserta en el contenedor un bloque de SVGs que define tres símbolos:
 *    - `check-circle-fill`: Un ícono de círculo con una marca de verificación.
 *    - `info-fill`: Un ícono de información.
 *    - `exclamation-triangle-fill`: Un ícono de triángulo de advertencia.
 * 3. Configura el estilo del contenedor para que esté oculto (`display: none`).
 * 4. Inserta el contenedor al principio del `<body>` del documento.
 *
 * @function
 */
function customIcon() {
    // Crear un contenedor de SVGs
    const svgContainer = document.createElement('div');

    // Añadir SVGs al contenedor
    svgContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
          <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </symbol>
          <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </symbol>
          <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </symbol>
        </svg>
      `;

    // Ocultar el contenedor
    svgContainer.style.display = 'none';

    // Insertar el contenedor al principio del <body>
    document.body.insertBefore(svgContainer, document.body.firstChild);
}


// Exportar las funciones necesarias
export { initializeCodeMirror, handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult, escapeHtml, loadVersion, customIcon };