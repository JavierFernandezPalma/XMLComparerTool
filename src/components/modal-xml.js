// Define un nuevo elemento personalizado 'text-area-xml'
class modalXML extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Crea un shadow DOM abierto
    }

    static get observedAttributes() {
        return ["title", "titleLabel1", "titleLabel2", "titletextarea1", "titletextarea2",
            "inputid1", "inputid2", "namefunction", "modalid", "numimputs", "numtextareas",
            "idtextarea1", "idtextarea2"];
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[`_${attr}`] = newVal; // Actualiza la propiedad correspondiente
        }
    }

    generateInputs() {
        let inputsHtml = '';
        const numInputs = parseInt(this._numimputs) || 1;

        for (let i = 1; i <= numInputs; i++) {
            const titleLabel = this[`_titleLabel${i}`] || this._titleLabel || `Campo ${i}`;
            const inputId = this[`_inputId${i}`] || this._inputId || `Input ${i}`;

            inputsHtml += `
                <div class="mb-3">
                    <label for="${inputId}" class="form-label">${titleLabel}:</label>
                    <input id="${inputId}" class="form-control" type="text" placeholder="Campo ${i}">
                </div>
            `;
        }

        return inputsHtml;
    }

    generateTextareas() {
        let textareasHtml = '';
        const numTextareas = parseInt(this._numtextareas) || 1;

        for (let i = 1; i <= numTextareas; i++) {
            const titleTextarea = this[`_titleTextarea${i}`] || this._titleTextarea || `Campo ${i}`;
            const idTextarea = this[`_idTextarea${i}`] || this._idTextarea;
            textareasHtml += `
                <div class="mb-3">
                    <label for="${idTextarea}" class="form-label">${titleTextarea}:</label>
                    <textarea class="form-control" id="${idTextarea}"></textarea>
                </div>
            `;
        }

        return textareasHtml;
    }

    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="modal fade" id="${this._modalId || 'myModal'}" tabindex="-1" aria-labelledby="modalCausaLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalCausaLabel">${this._titleModal}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${this.generateInputs()}
                            ${this.generateTextareas()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="${this._nameFunction}">Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>                
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles() {
        return `
            <!-- Bootstrap CSS: Estilos de la interfaz de usuario -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
            </style>
        `;
    }

    render() {
        // // Limpiar cualquier modal anterior si ya existe
        // const existingModal = this.shadowRoot.querySelector(`#${this._modalId}`);
        // if (existingModal) {
        //     console.log('Si existia modal, eliminando.')
        //     // Destruir el modal existente
        //     $(existingModal).modal('dispose');  // Destruye cualquier instancia previa del modal
        //     existingModal.remove(); // Elimina el modal del DOM
        // }else{
        //     console.log('No existia modal.')
        // }

        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Al cerrar el modal, se renderiza de nuevo la plantilla
        this.shadowRoot.querySelector(`#${this._modalId}`).addEventListener('hidden.bs.modal', () => {
            // Renderizar el modal de nuevo
            this.render();
        });
    }

    connectedCallback() {
        this._titleModal = this.getAttribute("title") || "Título del modal";
        this._titleLabel1 = this.getAttribute("titleLabel1") || "Título del campo";
        this._titleLabel2 = this.getAttribute("titleLabel2") || "Título del campo";
        this._titleTextarea1 = this.getAttribute("titletextarea1") || "Título del Textarea";
        this._titleTextarea2 = this.getAttribute("titletextarea2") || "Título del Textarea";
        this._inputId1 = this.getAttribute("inputid1") || "inputid1";
        this._inputId2 = this.getAttribute("inputid2") || "inputid2";
        this._nameFunction = this.getAttribute("namefunction") || "saveChanges";
        this._modalId = this.getAttribute("modalid") || "myModal";
        this._numimputs = this.getAttribute("numimputs");
        this._numtextareas = this.getAttribute("numtextareas");
        this._idTextarea1 = this.getAttribute("idtextarea1") || "idtextarea1";
        this._idTextarea2 = this.getAttribute("idtextarea2") || "idtextarea2";

        this.render();
    }
}

customElements.define('modal-xml', modalXML);
