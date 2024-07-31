import { showAlert } from '../utils.js';

async function handleValidateXML(event) {
    event.preventDefault();

    const xmlInput = window.editor1.getValue();
    const xsdInput = window.editor2.getValue();

    if (xmlInput.trim() === '' || xsdInput.trim() === '') {
        showMessageContainer('Por favor ingrese tanto XML como XSD para validar.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ xml: xmlInput, xsd: xsdInput })
        });

        if (response.status === 200) {
            const result = await response.json();
            displayValidationResult(result.isValid, result.message);
        } else if (response.status === 400) {
            const result = await response.json();
            displayValidationResult(result.isValid, result.message, result.validationErrors);
        } else if (response.status === 500) {
            const result = await response.json();
            displayValidationResult(result.isValid, result.details.message, result.validationErrors);
        } else {
            showMessageContainer('Error al validar el XML');
        }
    } catch (error) {
        console.error('Error al validar:', error);
        showMessageContainer('Error al validar el XML');
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
