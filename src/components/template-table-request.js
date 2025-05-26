// Define un nuevo elemento personalizado 'template-table'
class templateTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Crea un shadow DOM abierto
    }

    static get observedAttributes() {
        return ["templateid", "accordionid", "headingid", "collapseid", "buttonname", "tableid", "conteinername"];
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[`_${attr}`] = newVal; // Actualiza la propiedad correspondiente
        }
    }

    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <!-- Template para mostrar tabla ${this._buttonname} Request -->
            <template id="${this._templateid}">
                <div class="accordion" id="${this._accordionid}">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="${this._headingid}">
                            <button class="accordion-button bg-verde" type="button" data-bs-toggle="collapse"
                                data-bs-target="#${this._collapseid}" aria-expanded="true"
                                aria-controls="${this._collapseid}">
                                ${this._buttonname} - Request
                            </button>
                        </h2>
                        <div id="${this._collapseid}" class="accordion-collapse collapse show"
                            aria-labelledby="${this._headingid}">
                            <div class="accordion-body">
                                <table id="${this._tableid}" class="display" style="display:none;">
                                    <thead>
                                        <tr id="tableHeaders">
                                            <!-- Los encabezados se generarán dinámicamente -->
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody">
                                        <!-- Aquí se llenarán las filas dinámicamente -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- Contenedor donde se insertará el template la tabla ${this._buttonname} Request -->
            <div id="${this._conteinername}"></div>                
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles() {
        return `
            <!-- Enlace a Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
            <style>
            </style>
        `;
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
            const script = this.shadowRoot.document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.scriptsLoaded++; // Incrementa el contador cuando un script se carga
                if (this.scriptsLoaded === scripts.length) {
                    // Todos los scripts se han cargado, inicializamos CodeMirror
                    // this.initializeCodeMirror(this._textareaId); // Inicializar CodeMirror cuando se cargue el JS
                }
            };
            this.shadowRoot.body.appendChild(script); // Añadir al shadow DOM
            this.shadowRoot.document.close();
        });
    }

    render() {

        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    }

    connectedCallback() {
        this._templateid = this.getAttribute("templateid") || "templateDemo";
        this._accordionid = this.getAttribute("accordionid") || "accordionDemo";
        this._headingid = this.getAttribute("headingid") || "headingDemo";
        this._collapseid = this.getAttribute("collapseid") || "collapseDemo";
        this._buttonname = this.getAttribute("buttonname") || "buttonNameDemo";
        this._tableid = this.getAttribute("tableid") || "table1";
        this._conteinername = this.getAttribute("conteinername") || "conteinerNameDemo";

        this.render();

        // this.loadCodeMirrorScripts(); // Llama a la función para cargar los scripts
    }
}

customElements.define('template-table-request', templateTable);