// Define el Web Component personalizado <xml-tools-menu>
class xmlToolsMenu extends HTMLElement {

    // Constructor del componente
    constructor() {
        super(); // Llama al constructor de HTMLElement
        this.attachShadow({ mode: "open" }); 
        // Crea un Shadow DOM abierto para encapsular HTML y CSS
    }

    // Genera y devuelve el template HTML del componente
    getTemplate() {
        // Crea un elemento <template> para definir el contenido reutilizable
        const template = document.createElement("template");

        // Define el HTML del menú
        template.innerHTML = `
            <!-- Enlace a la comparación de estructuras XML -->
            <a class="dropdown-item" href="index.html">
                <i class="bi bi-file-diff me-2"></i> Comparar Estructuras XML
            </a>

            <!-- Enlace a la validación de XML -->
            <a class="dropdown-item" href="validarXML.html">
                <i class="bi bi-check-circle me-2"></i> Validar XML
            </a>

            <!-- Enlace al inventario de certificados -->
            <a class="dropdown-item" href="inventarioCert.html">
                <i class="bi bi-folder2-open me-2"></i> Inventario Certificados
            </a>

            <!-- Enlace al log de errores -->
            <a class="dropdown-item" href="logErrores.html">
                <i class="bi bi-exclamation-triangle me-2"></i> Log de errores
            </a>

            <!-- Enlace a mapeos de mensajes -->
            <a class="dropdown-item" href="mapeosMensajes.html">
                <i class="bi bi-diagram-3 me-2"></i> Mapeos de mensajes
            </a>

            <!-- Enlace a la gestión de practicantes -->
            <a class="dropdown-item" href="usuarios.html">
                <i class="bi bi-people me-2"></i> Gestión de practicantes
            </a>

            <!-- Inserta los estilos necesarios dentro del Shadow DOM -->
            ${this.getStyles()}
        `;

        // Retorna el template configurado
        return template;
    }

    // Devuelve los estilos necesarios para el componente
    getStyles() {
        return `
            <!-- Bootstrap CSS: estilos base de la interfaz -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

            <!-- Bootstrap Icons: requerido para renderizar los iconos -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
        `;
    }

    // Método del ciclo de vida: se ejecuta cuando el componente se añade al DOM
    connectedCallback() {
        // Clona el contenido del template y lo inserta en el Shadow DOM
        this.shadowRoot.appendChild(
            this.getTemplate().content.cloneNode(true)
        );
    }
}

// Registra el componente personalizado para poder usar <xml-tools-menu>
customElements.define("xml-tools-menu", xmlToolsMenu);
