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

import { clearComparisonResult } from '../scripts/config.js';

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
     * Carga única, ordenada y asíncrona de scripts de CodeMirror si no están en el DOM.
     * 
     * Carga los siguientes scripts:
     * - codemirror.min.js (núcleo)
     * - xml.min.js (modo XML)
     * - javascript.min.js (modo JSON)
     * - fullscreen.min.js (modo pantalla completa)
     * - simplescrollbars.min.js (scroll personalizado)
     * - placeholder.min.js (texto de ayuda en vacío)
     * 
     * @returns {Promise<void>} Promesa que se resuelve al terminar la carga.
     */
    static codeMirrorReady = null;

    async loadCodeMirrorScripts() {
        // Evita múltiples cargas si ya está en progreso o finalizado
        if (textAreaXML.codeMirrorReady) return textAreaXML.codeMirrorReady;

        /**
         * Carga un script si no existe ya en el DOM.
         * @param {string} src - URL del script.
         * @returns {Promise<void>} Promesa resuelta al cargar (o si ya está).
         */
        const loadScript = (src) => new Promise((resolve, reject) => {
            const fullSrc = new URL(src, document.baseURI).href;

            const alreadyExists = Array.from(document.scripts).some(script =>
                script.src === fullSrc
            );

            if (alreadyExists) {
                resolve(); // Ya está cargado
                return;
            }

            const script = document.createElement('script');
            script.src = fullSrc;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });

        // Lista de grupos con base y scripts relativos
        const scriptGroups = [
            {
                // Base de los scripts
                base: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/',
                // Lista de scripts a cargar en orden
                files: [
                    'codemirror.min.js',                     // núcleo
                    'mode/xml/xml.min.js',                   // modo XML
                    'addon/display/fullscreen.min.js',       // pantalla completa
                    'addon/scroll/simplescrollbars.min.js',  // scroll estilizado
                    'addon/display/placeholder.min.js'       // placeholder
                ]
            },
            {
                base: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/',
                files: [
                    'mode/javascript/javascript.min.js' // mono JSON
                ]
            }
        ];

        // Ejecuta carga secuencial una sola vez
        textAreaXML.codeMirrorReady = (async () => {
            for (const group of scriptGroups) {
                for (const file of group.files) {
                    await loadScript(group.base + file);
                }
            }
        })();

        return textAreaXML.codeMirrorReady;
    }

    /**
     * Configura el evento 'codemirror-ready' para limpiar el contenido del editor y el resultado de comparación.
     * @param {string} elementId - ID del componente personalizado (<text-area-xml>).
     * @param {string} clearBtnId - ID del botón dentro del Shadow DOM para limpiar el editor.
     * @param {string} editorGlobalName - Nombre para exponer el editor en `window`.
     */
    setupEditorClearEvent(elementId, clearBtnId, editorGlobalName) {
        const customElement = document.getElementById(elementId);
        if (!customElement) return;

        customElement.addEventListener('codemirror-ready', () => {
            const editor = customElement.getCodeMirrorInstance();
            const clearBtn = customElement.shadowRoot.getElementById(clearBtnId);
            if (editor && clearBtn) {
                clearBtn.addEventListener('click', () => {
                    editor.setValue(''); // Limpiar contenido de xmlInput2
                    clearComparisonResult(); // Limpiar resultado de comparación
                });

                // Exponer el editor en window para uso global
                if (editorGlobalName) window[editorGlobalName] = editor;
            }
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

        // Inicializa eventos para limpiar los dos editores y exponer los editores en `window`.
        this.setupEditorClearEvent('textarea1', 'clearXmlInput1', 'editor1');
        this.setupEditorClearEvent('textarea2', 'clearXmlInput2', 'editor2');

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
        this.loadCodeMirrorScripts().then(() => {
            // Espera un tick para asegurarse que textarea está en el shadow DOM
            setTimeout(() => {
                this.codemirrorInstance = this.initializeCodeMirror(this._textareaId);
                if (this.codemirrorInstance) {
                    this.statusReadOnly(this._readonly);
                    this.statusPlaceholder(this._placeholder);
                    this.codemirrorInstance.refresh();

                    // 🚀 Emitir evento cuando editor esté listo
                    this.dispatchEvent(new CustomEvent('codemirror-ready', {
                        detail: this.codemirrorInstance
                    }));
                }
            }, 0);
        }).catch(err => {
            console.error("Error cargando scripts de CodeMirror:", err);
        });

    }
}

// Registra el elemento personalizado
customElements.define('text-area-xml', textAreaXML);