// Función genérica para insertar contenido de un template en un contenedor
function insertTemplateContent(templateId, containerId, buttonText) {
  if (!document.createElement("template").content) {
    console.warn("El elemento template no es compatible con este navegador.");
    return;
  }

  const template = document.querySelector(`#${templateId}`);
  const container = document.querySelector(`#${containerId}`);

  if (!template || !container) {
    console.error("Template o contenedor no encontrado.");
    return;
  }

  const button = template.content.querySelector("button");
  if (button) {
    button.textContent = buttonText;
  }

  const clone = document.importNode(template.content, true);
  container.appendChild(clone);
}

// Función específica para la sección de eliminación de archivos XML
export function loadDeleteXMLTemplate() {
  insertTemplateContent("templateEliminarArchivosXML", "containerEliminarArchivosXML", "Borrar Archivos (plantillas) XML");
}

// Función específica para la sección de subida de archivos XML
export function loadUploadXMLTemplate() {
  insertTemplateContent("templateSubirArchivosXML", "containerSubirArchivosXML", "Subir Archivos (plantillas) XML");
}

export function mostrarAccordionDummyoRequest() {
  insertTemplateContent("templateDummyRequest", "containerDummyRequest", "VerificarEstadoWebService - Request");
}

export function mostrarAccordionConsultaNumeroRequest() {
  insertTemplateContent("templateConsultaFacturaPorNumeroRequest", "containerConsultaFacturaPorNumeroRequest", "ConsultaFacturaPorNumero - Request");
}

export function mostrarAccordionPagoRequest() {
  insertTemplateContent("templateRegistrarPagoIFXRequest", "containerRegistrarPagoIFXRequest", "RegistrarPagoIFX - Request");
}

export function mostrarAccordionDummyResponse() {
  insertTemplateContent("templateDummyResponse", "containerDummyResponse", "VerificarEstadoWebService - Response");
}

export function mostrarAccordionConsultaNumeroResponse() {
  insertTemplateContent("templateConsultaFacturaPorNumeroResponse", "containerConsultaFacturaPorNumeroResponse", "ConsultaFacturaPorNumero - Response");
}

export function mostrarAccordionPagoResponse() {
  insertTemplateContent("templateRegistrarPagoIFXResponse", "containerRegistrarPagoIFXResponse", "RegistrarPagoIFX - Response");
}

