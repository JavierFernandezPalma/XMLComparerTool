export function useRegex(contenidoCampo) {
  let escapedContent = contenidoCampo.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
//   console.log(escapedContent);

  // Reemplazar dígitos por \d letras por \w+ y espacios s+
  let regexPattern = escapedContent
    .replace(/[a-zA-Z]+/g, "\\w+")
    .replace(/\d/g, "\\d")
    .replace(/(\s+)/g, "\\s+");

//   console.log("regexPattern: ", regexPattern);
  // Crear la expresión regular
  return new RegExp(`^${regexPattern}$`);
}

// Ejemplos de uso
// let contenido1 = "14:45:24T15:05:10";
// let regex1 = useRegex(contenido1);
// console.log(regex1.test("12:34:56T07:08:09")); //true