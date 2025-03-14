class myElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.img = this.getAttribute('img');

    }
    static get observedAttributes() {
        return ["title", "parrafo"];
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === "title" && oldVal !== newVal) {
            this.title = newVal;
        }

        // oldVal !== newVal ? this[attr] = newVal : null;
    }
    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
        <div>
            <h1>${this.title}</h1>
            <h2>
                <slot name="prueba"></slot>
            </h2>
            <img src=${this.img} />
        </div>
        ${this.getStyles()}
        `;
        return template;
    }
    getStyles() {
        return `
        <style>
        :host {
        display: inline-block;
        }
            h2{
                color: red;
            }
        </style>
        `;
    }
    render() {
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }
    connectedCallback() {
        this.render();
    }
}

customElements.define('my-element', myElement);