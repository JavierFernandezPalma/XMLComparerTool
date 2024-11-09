import xml2js from 'xml2js';

// Función para parsear el XML y extraer la información
export function procesarXML(xmlData, callback) {
    const parser = new xml2js.Parser();
    
    parser.parseString(xmlData, (err, result) => {
        if (err) {
            callback("Error al parsear el XML: " + err, null);
            return;
        }

        // Obtener el inventario de certificados
        const inventory = result.CertificatesInventory;
        const appliance = inventory.$.appliance;
        const generated = inventory.$.generated;

        let output = `Inventario de Certificados para el Appliance: ${appliance}\n`;
        output += `Generado el: ${generated}\n\n`;

        // Acceder a la lista de certificados
        const certificados = inventory.Certificates[0].Certificate;

        certificados.forEach((cert, index) => {
            const serialNumber = cert.$['serial-number'];
            const subject = cert.Subject[0];
            const creationDate = cert.CreationDate[0];
            const expirationDate = cert.ExpirationDate[0];
            const daysToExpire = cert.DaysToExpire[0];
            const base64 = cert.Base64[0];

            output += `Certificado ${index + 1}:\n`;
            output += `  Número de Serie: ${serialNumber}\n`;
            output += `  Subject: ${subject}\n`;
            output += `  Fecha de Creación: ${creationDate}\n`;
            output += `  Fecha de Expiración: ${expirationDate}\n`;
            output += `  Días para Expirar: ${daysToExpire}\n`;
            output += `  Base64: ${base64}\n`;

            // Acceder a los CryptoCertificates
            const cryptoCerts = cert.CryptoCertificates[0].CryptoCertificate;

            output += `  CryptoCertificates:\n`;
            cryptoCerts.forEach((cryptoCert, cIndex) => {
                const domain = cryptoCert.$.domain;
                const name = cryptoCert.$.name;
                const file = cryptoCert.$.file;

                output += `    CryptoCertificate ${cIndex + 1}:\n`;
                output += `      Dominio: ${domain}\n`;
                output += `      Nombre: ${name}\n`;
                output += `      Archivo: ${file}\n`;
            });

            output += '\n-----------------------------------\n';
        });

        callback(null, output);
    });
}
