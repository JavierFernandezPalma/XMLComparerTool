export function showAlert(message) {
    alert(message);
}

export function showMessageContainer(message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerText = message;
    messageContainer.style.color = 'red'; // Cambia el color del texto si es necesario
}

export function displayValidationResult(isValid) {
    const messageContainer = document.getElementById('messageContainer');
    if (isValid) {
        messageContainer.innerText = 'El XML es válido respecto al XSD.';
        messageContainer.style.color = 'green'; // Cambia el color del texto si es necesario
    } else {
        messageContainer.innerText = 'El XML no es válido respecto al XSD.';
        messageContainer.style.color = 'red'; // Cambia el color del texto si es necesario
    }
}
