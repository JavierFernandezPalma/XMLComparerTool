import { useRegex } from "./useRegex.js";
export function validaContenido(node1,node2,result){
    let contenido = node1.textContent;
    let contenido2 = node2.textContent;
    let regExpNode1 = useRegex(contenido);
    
    if (!regExpNode1.test(contenido2)) {
        
        if (
          node1.nodeName !== "Org" &&
          node1.nodeName !== "Name" &&
          node1.nodeName !== "StatusDesc" &&
          node1.nodeName !== "Amt" &&
          node1.nodeName !== "StatusCode"
        ) {
          result += '<div class="alert alert-warning py-1 ms-4 mt-0 px-auto" role="alert">' +
          '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">' +
          '<use xlink:href="#exclamation-triangle-fill"/></svg>' +
          `El contenido del nodo &#60;${node1.nodeName}&#62; no coincide con el de referencia.` +
          '</div>';
        }
        if(node1.nodeName === "Amt" ){
            regExpNode1 = new RegExp(`^${"\\d+.\\d\\d"}$`);
            regExpNode1.test(contenido2) === false
              ? (result += `<div class="alert alert-primary py-1 ms-4 mt-0 px-auto">`+
                '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">' +
                '<use xlink:href="#info-fill"/></svg>' +
                `El contenido del nodo &#60;${node1.nodeName}&#62; debe ser numérico con 2 decimales.</div>`)
              : null;
        }
        if(node1.nodeName === "StatusCode" ){
            result += `<div class="alert alert-primary py-1 ms-4 mt-0 px-auto">`+
            '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">' +
            '<use xlink:href="#info-fill"/></svg>' +
            `Los posibles valores de &#60;${node1.nodeName}&#62; pueden ser: (0, -001, -002, -003, -004, -005, -006, -099).</div>`;
        }
        if(node1.nodeName === "StatusDesc" ){
          result += `<div class="alert alert-primary py-1 ms-4 mt-0 px-auto">`+
          '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">' +
          '<use xlink:href="#info-fill"/></svg>' +
          `La descripción del nodo &#60;${node1.nodeName}&#62; debe coincidir con el estándar, no se admite modificaciones.</div>`;
      }
    }
    return result; 
}