export function useRegex(contenidoCampo) {
  //escapar para cuando viene un caracter especial.
  let escapedContent = contenidoCampo.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  //console.log(escapedContent);

  // Reemplazar dígitos por \d letras por \w+ y espacios s+
  let regexPattern = escapedContent
    .replace(/[a-zA-Z]+/g, "\\w+")
    .replace(/\d/g, "\\d")
    .replace(/(\s+)/g, "\\s+");

  // Crear la expresión regular
  return new RegExp(`^${regexPattern}$`);
}
