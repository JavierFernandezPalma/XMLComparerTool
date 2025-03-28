import { showAlert } from '../utils.js';

async function handleValidateXML(event) {
    event.preventDefault();

    const xmlInput = window.editor1.getValue();
    const xsdInput = window.editor2.getValue();

    // if (xmlInput.trim() === '' || xsdInput.trim() === '') {
    //     showMessageContainer('Por favor ingrese tanto XML como XSD para validar.');
    //     return;
    // }

    const apiUrl = process.env.APP_API_URL || 'https://xmlcomparertool.onrender.com';
    const pathUrl = process.env.VALIDATE_API_PATH || '/api/v1/validateXML/validate'

    try {
        const response = await fetch(`${apiUrl}${pathUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ xml: xmlInput, xsd: xsdInput })
        });

        const result = await response.json();
        const output = document.getElementById('validationResult');
        output.innerHTML = result.valid ? `<div class="match"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>XML es válido: ${result.message}</div>` : `<div class="error"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>XML no es válido: ${result.message}</div>`;
    } catch (error) {
        console.error('Error:', error);
        const output = document.getElementById('validationResult');
        output.textContent = 'Error de conexión: ' + error.message;
    }
}

export function showMessageContainer(message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerText = message;
    messageContainer.style.color = 'red'; // Cambia el color del texto si es necesario
}

function displayValidationResult(isValid, message, validationErrors = []) {
    const validationResult = document.getElementById('validationResult');
    const messageContainer = document.getElementById('messageContainer');

    validationResult.textContent = message;

    if (!isValid && validationErrors.length > 0) {
        messageContainer.innerHTML = '<h5>Errores de validación:</h5>';
        validationErrors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.textContent = `Línea ${error.line}, Columna ${error.column}: ${error.message}`;
            messageContainer.appendChild(errorItem);
        });
    } else if (validationErrors.length > 0) {
        messageContainer.innerHTML = validationErrors[0];
    } else {
        messageContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const validateButton = document.getElementById('validateButton');
    validateButton.addEventListener('click', handleValidateXML);
});
