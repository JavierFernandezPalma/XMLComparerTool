// https://www.webcomponents.org/

/**
 * Componente personalizado 'text-area-xml' que usa CodeMirror para un editor XML.
 * 
 * Este componente permite la edición de código XML con características como:
 * - Resaltado de sintaxis
 * - Cambio de temas (Monokai, Abbott, etc.)
 * - Pantalla completa
 * 
 * Requiere la integración de los scripts de CodeMirror para su funcionamiento.
 * 
 * Dependencias:
 * - CodeMirror (https://cdnjs.cloudflare.com/ajax/libs/codemirror/)
 * - Bootstrap (para estilos)
 * - Fullscreen (para soporte de modo pantalla completa)
 * 
 * Asegúrar cargar los scripts y las hojas de estilo adecuadas antes de inicializar el editor.
 */

// Define un nuevo elemento personalizado 'text-area-xml'
class textAreaXML extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Crea un shadow DOM abierto
        this.scriptsLoaded = 0; // Contador para seguir cuántos scripts se han cargado
    }

    // Especifica los atributos observados para cambios
    static get observedAttributes() {
        return ["title", "titleformat", "titleclear", "buttonformatid", "buttonclearid", "textareaid", "readonly", "placeholder", "showmode"];
    }

    /**
     * Callback para manejar cambios en los atributos del componente.
     * @param {string} attr - El nombre del atributo modificado.
     * @param {string} oldVal - El valor anterior del atributo.
     * @param {string} newVal - El valor nuevo del atributo.
     */
    // Gestiona los cambios de atributos
    attributeChangedCallback(attr, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[`_${attr}`] = newVal; // Actualiza la propiedad correspondiente
        }
    }

    // Genera el template HTML con valores predeterminados o personalizados
    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="d-flex align-items-center">
                <label for="${this._textareaId || 'xmlInput'}" class="form-label">${this._title}</label>
                <div class="ms-auto d-flex align-items-center">                
                    <!-- Lista de Selección de Tema -->
                    <label for="themeSelector" class="form-label me-2">Tema</label>
                    <select id="themeSelector" class="form-select form-select-sm w-auto">
                        <option value="monokai">monokai</option>
                        <option value="default">default</option>
                        <option value="abbott">abbott</option>
                        <option value="neo">neo</option>
                        <option value="night">night</option>
                        <option value="rubyblue">rubyblue</option>
                    </select>
                    <!-- Lista de Selección de Mode (XML a JSON) -->
                    <div class="${this._showmode === 'true' ? 'd-flex' : 'd-none'} align-items-center">
                        <label for="modeSelectorLabel" class="form-label ms-3 me-2">Modo</label>
                        <select id="modeSelectorSelect" class="form-select form-select-sm w-auto">
                            <option value="xml">XML</option>
                            <option value="application/json">JSON</option>
                        </select>
                    </div>
                </div>
            </div>
            <textarea class="form-control" id="${this._textareaId || 'xmlInput'}" placeholder="Ingresa código aquí" rows="10"></textarea>
            <div class="d-flex justify-content-end mt-2">
                <button id="${this._buttonFormatId || 'formatXmlInput'}" class="btn btn-secondary me-2">${this._titleFormat}</button>
                <button id="${this._buttonClearId || 'clearXmlInput'}" class="btn btn-warning">${this._titleClear}</button>
            </div>
            ${this.getStyles()}
        `;
        return template;
    }

    // Devuelve los estilos CSS para el componente
    getStyles() {
        return `
        <!-- Bootstrap CSS: Estilos de la interfaz de usuario -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- CodeMirror CSS: Estilos para el editor CodeMirror -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.css">
        <!-- Temas de CodeMirror: Estilos para los diferentes temas disponibles -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/monokai.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/abbott.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/neo.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/night.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/rubyblue.min.css">
        <!-- Fullscreen CSS: Estilos para habilitar el modo pantalla completa en CodeMirror -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/display/fullscreen.min.css">
        <!-- SimpleScrollbars CSS: Estilos para habilitar simpleScrollbars -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/scroll/simplescrollbars.min.css">
         <!-- Estilos personalizados adicionales para el editor -->
        <style>
            /* Estilo básico para el contenedor principal del editor */
            .CodeMirror {
                height: auto; /* Altura automática para adaptarse al contenido */
                border: 1px solid #ddd;  /* Borde gris claro para el editor */
                margin-bottom: 20px;  /* Espacio inferior para separación */
            }
            /* Estilo para la parte desplazable del editor */
            .CodeMirror-scroll {
                min-height: 20px;  /* Altura mínima para el área desplazable */
            }
            .CodeMirror-fullscreen {
                margin-bottom: 10%;  /* Espacio inferior para separación */
            }
            /* Estilo para placeholder en CodeMirror */
            .CodeMirror-placeholder {
                color: #888; /* Puedes personalizar el color aquí */
                font-style: italic;
            }
        </style>
        `;
    }

    // Actualiza el tema de CodeMirror
    updateTheme(theme) {
        this._theme = theme;
        const codemirrorInstance = this.shadowRoot.querySelector('.CodeMirror');
        if (codemirrorInstance) {
            codemirrorInstance.CodeMirror.setOption('theme', theme); // Cambia el tema de CodeMirror
        }
    }

    // Actualiza el modo de CodeMirror
    updateMode(mode) {
        this._mode = mode;
        const codemirrorInstance = this.shadowRoot.querySelector('.CodeMirror');
        if (codemirrorInstance) {
            codemirrorInstance.CodeMirror.setOption('mode', mode); // Cambia el modo de CodeMirror
        }
    }

    // Establece el modo de solo lectura en CodeMirror
    statusReadOnly(readonly) {
        const codemirrorInstance = this.shadowRoot.querySelector('.CodeMirror');
        if (codemirrorInstance) {
            const readOnlyFlag = readonly === 'true' ? true : false;
            codemirrorInstance.CodeMirror.setOption('readOnly', readOnlyFlag); // Cambia la opción 'readonly'
        }
    }

    // Actualiza la opción 'placeholder' de CodeMirror
    statusPlaceholder(placeholder) {
        const codemirrorInstance = this.shadowRoot.querySelector('.CodeMirror');
        if (codemirrorInstance) {
            codemirrorInstance.CodeMirror.setOption('placeholder', placeholder); // Cambia la opción 'placeholder'
        }
    }

    /**
     * Función para cargar dinámicamente los scripts de CodeMirror.
     * 
     * Carga los siguientes scripts:
     * - CodeMirror (la biblioteca principal)
     * - xml.min.js - xml2js.min.js (modo XML para CodeMirror)
     * - Fullscreen.js (para habilitar el modo pantalla completa)
     */
    // Cargar los scripts de CodeMirror dinámicamente
    loadCodeMirrorScripts() {
        const scripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/xml/xml.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/display/fullscreen.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/scroll/simplescrollbars.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/display/placeholder.min.js'
        ];

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.scriptsLoaded++; // Incrementa el contador cuando un script se carga
                if (this.scriptsLoaded === scripts.length) {
                    // Todos los scripts se han cargado, inicializamos CodeMirror
                    // this.initializeCodeMirror(this._textareaId); // Inicializar CodeMirror cuando se cargue el JS
                }
            };
            this.shadowRoot.appendChild(script); // Añadir al shadow DOM
        });
    }

    // Renderiza el template y lo inserta en el shadow DOM
    render() {
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Agregar el evento para cambiar el tema
        const themeSelector = this.shadowRoot.querySelector('#themeSelector');
        themeSelector.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            this.updateTheme(selectedTheme); // Cambia el tema cuando se selecciona una opción
        });

        // Agregar el evento para cambiar el modo
        const modeSelector = this.shadowRoot.querySelector('#modeSelectorSelect');
        modeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;
            this.updateMode(selectedMode); // Cambia el modo cuando se selecciona una opción
        });

    }

    /**
     * Método público para obtener la instancia de CodeMirror
     * @returns {CodeMirror.Editor} La instancia de CodeMirror asociada al textarea
     */
    getCodeMirrorInstance() {
        return this.codemirrorInstance;
    }

    /**
     * Inicializa el editor CodeMirror con la configuración para XML.
     * 
     * @param {string} elementId - El id del elemento <textarea> que se va a convertir en CodeMirror.
     */
    // Inicializa el editor CodeMirror con la configuración XML
    initializeCodeMirror(elementId) {
        const textarea = this.shadowRoot.querySelector(`#${elementId}`);
        if (textarea) {
            return CodeMirror.fromTextArea(textarea, {
                mode: 'xml',
                theme: 'monokai', // Tema Monokai para el editor (default - eclipse - material - solarized)
                lineNumbers: true, // Habilitar números de línea
                autoCloseTags: true, // Cierre automático de etiquetas
                matchTags: { bothTags: true }, // Resaltar etiqueta coincidente
                showCursorWhenSelecting: true, // Cursor visible al seleccionar texto
                matchBrackets: true, // Resalta los paréntesis y corchetes coincidentes
                placeholder: "Ingresa código aquí...",
                readOnly: false, // Habilita la edición (No se puede hacer edición si está activo)
                // smartIndent: true, // Indentación automática inteligente
                // scrollbarStyle: 'simple', // Barras de desplazamiento 'simple' o 'overlay'
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    }
                } // Función adicional 'Ctrl-Space' activa autocompletado
            });
        } else {
            console.error("Textarea no encontrado dentro del shadow DOM");
        }
    }

    /**
     * Método llamado cuando el componente es insertado en el DOM.
     * Inicializa y configura el componente.
     */
    // Se ejecuta cuando el componente es conectado al DOM
    connectedCallback() {
        // Asigna valores predeterminados o de los atributos
        this._title = this.getAttribute('title') || "Descripción del XML";
        this._titleFormat = this.getAttribute('titleformat') || "Formatear XML";
        this._titleClear = this.getAttribute('titleclear') || "Limpiar XML";
        this._buttonFormatId = this.getAttribute('buttonformatid') || "formatXmlInput";
        this._buttonClearId = this.getAttribute('buttonclearid') || "clearXmlInput";
        this._textareaId = this.getAttribute('textareaid') || 'xmlInput';
        this._readonly = this.getAttribute('readonly') || 'false';
        this._placeholder = this.getAttribute('placeholder') || 'Ingresa código aquí...';
        this._showmode = this.getAttribute('showmode') || 'false';

        this.render(); // Renderiza el componente

        // // Carga los scripts de CodeMirror y luego inicializa el editor
        // this.loadCodeMirrorScripts(); // Llama a la función para cargar los scripts

        // Observar cambios en el shadow DOM para detectar la carga de CodeMirror
        const observer = new MutationObserver(() => {
            const codemirrorInstance = this.shadowRoot.querySelector('.CodeMirror');
            if (codemirrorInstance) {
                this.codemirrorInstance = codemirrorInstance.CodeMirror;
                this.statusReadOnly(this._readonly);
                this.statusPlaceholder(this._placeholder);
                // Refrescar el editor para aplicar los cambios (en este caso el placeholder y otros ajustes)
                this.codemirrorInstance.refresh();
                observer.disconnect(); // Dejar de observar una vez que se ha encontrado CodeMirror
            }
        });

        observer.observe(this.shadowRoot, { childList: true, subtree: true });

        // Inicializa CodeMirror si se requiere
        this.initializeCodeMirror(this._textareaId); // Opcional, si se necesita cargar dinámicamente los scripts
    }
}

// Registra el elemento personalizado
customElements.define('text-area-xml', textAreaXML);