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
          result += `<div class="info2">el contenido del nodo &#60;${node1.nodeName}&#62; no coincide con el de referencia.</div>`;
        }
        if(node1.nodeName === "Amt" ){
            regExpNode1 = new RegExp(`^${"\\d+.\\d\\d"}$`);
            regExpNode1.test(contenido2) === false
              ? (result += `<div class="info">el contenido del nodo &#60;${node1.nodeName}&#62; debe ser numérico con 2 decimales.</div>`)
              : null;
        }
        if(node1.nodeName === "StatusCode" ){
            result += `<div class="info">Los posibles valores de &#60;${node1.nodeName}&#62; pueden ser: (0, -001, -002, -003, -004, -005, -006, -099).</div>`;
        }
    }
    return result; 
}