export function indexDeleteXML() {
  // Verifica si el navegador soporta el elemento template de HTML
    if ("content" in document.createElement("template")) {  // "content" contiene el contenido sin renderizar, es reservada para template
        const template = document.querySelector("#templateborrarplant");
        const containerborrarplant = document.querySelector("#containerborrarplant");       
        const button = template.content.querySelector("button");
        
        //modificar contenido de template
        button.textContent = "Borrar Archivos(plantillas) XML";
        
        
        const clone = document.importNode(template.content, true);
        containerborrarplant.appendChild(clone);
      }  
}
export function indexUploadXML() {
  if ("content" in document.createElement("template")) {  
        const template = document.querySelector("#templatesubirplant");
        const container = document.querySelector("#containersubirplant");
        const button = template.content.querySelector("button");

        //modificar contenido de template
        button.textContent = "Subir Archivos (plantillas) XML ";
        
        const clone = document.importNode(template.content, true);
        container.appendChild(clone);
      
      }  
}
  