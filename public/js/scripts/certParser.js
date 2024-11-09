const forge = require('node-forge');
const fs = require('fs');
const xml2js = require('xml2js');

/**
 * Lee la fecha de vencimiento de un certificado codificado en Base64.
 *
 * @param {string} certBase64 - Certificado en formato Base64.
 */

function leerFechaVencimiento(certBase64) {
  // Decodificar el certificado desde Base64 a formato DER (binario)
  const certDer = forge.util.decode64(certBase64);

  // Convertir el certificado DER a PEM (formato de texto)
  const certAsn1 = forge.asn1.fromDer(certDer);
  const cert = forge.pki.certificateFromAsn1(certAsn1);

  // Obtener la fecha de vencimiento
  const fechaVencimiento = cert.validity.notAfter;
  console.log(`La fecha de vencimiento del certificado es: ${fechaVencimiento}`);

  // Información del certificado
  const serialNumerico = BigInt(`0x${cert.serialNumber}`).toString();
  console.log("Número de serie:", serialNumerico);
  console.log("Fecha de inicio de validez:", cert.validity.notBefore);
  console.log("Fecha de expiración:", cert.validity.notAfter);
  console.log("Nombre común del sujeto:", cert.subject.getField('CN').value);
  console.log("Emisor:", cert.issuer.getField('CN').value);
  console.log("Clave pública:", cert.publicKey);
  console.log("Extensiones:", cert.extensions);
  console.log("Versión del certificado:", cert.version);
  console.log("Algoritmo de firma (OID):", cert.signatureOid);
}

// Cadena Base64 del certificado
const certificadoBase64 = `MIIDyDCCArCgAwIBAgIRAJ/RcEE/9uobv5jPDo2kmPUwDQYJKoZIhvcNAQELBQAwZzELMAkGA1UEBhMCQ08xDjAMBgNVBAoMBU5lcXVpMQswCQYDVQQLDAJUSTESMBAGA1UECAwJQW50aW9xdWlhMRQwEgYDVQQDDAtOZXF1aVJvb3RDQTERMA8GA1UEBwwITWVkZWxsaW4wHhcNMjQwMTEyMDQzNjQ4WhcNMjUwMjEwMDUzNjQ4WjArMSkwJwYDVQQDDCBpaWJhd3NkbGxvMDEuYmFuY2FkaWdpdGFsLmNvbS5jbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANz0FlC2wvzU/58Nr0VfRVqQs6fIqN7eUyye/TgjGmvBViV861cFOhnNJusgP1C7yC/a+zY0nq2E6rsUfaWKN2UVgcQtt2QNtPpb9Z8KXwS172pnK1apjw9g+sfiE9pRArTnaND5o6B42tn2tXiWxBXAbSAmfmPF4MikaZt8A8j83m69N+GtVj9by3jy86BCEQqAielgI/RSvQ8cCQOE91ODXh3tzTDUtAlnUEQAiaAhC6GFNLXh627Bz2jQWGhnJRIE6xRuk/l4aif6LPVBTP6MGrO/khhSyvQSrsHrCeoyJTmOE+ATFJIAPvRKpMCvOMe92EzrQ5MwNeNlTOq/Fc8CAwEAAaOBqjCBpzArBgNVHREEJDAigiBpaWJhd3NkbGxvMDEuYmFuY2FkaWdpdGFsLmNvbS5jbzAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFPB0LsbEvjTbUekNqm9YLBYw33CiMB0GA1UdDgQWBBTlGt522YpQZF4ziBzp7BQGw7gXtzAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMA0GCSqGSIb3DQEBCwUAA4IBAQCNzQU1MkLim+XvchphN5J7XdmYPhp1Nhf7hLobsMpa7ij/p6ZKJe2Ce9gDe32jnnh1ZCfCubAUl8qNwBSzCyGAVbmo28IFiLRagjZTzLctgJ+YnsJGlJ13jy6pe2SwcHxBilgezegOapXZnKewsNdGLrYdMw85VtDSOm3Is5ZUJbqmXlYtcHlUWH9CaSMZNNbB3DKBtNrJ7D2FWVM2MK0MoPNJHVml23m2TXjK6aq/Zt+a7wMkvqXBD1FYs1y5juQORbPzLopYoNBf8PP4/28N0M5ku/ZRDfQy/6XbAIczylWuhnBoq4nRU0ouv4flwtPZbRe19kMMhs/ZQBk3TPtD`;

// leerFechaVencimiento(certificadoBase64);

// XML proporcionado como una cadena
const xml = `
<CertificatesInventory appliance="ABMDEBDDTP02" generated="2024-09-02T10:07:08">
    <Certificates>
        <Certificate serial-number="212434718172737632096332653902776539381">
            <CryptoCertificates>
                <CryptoCertificate domain="ApoyoCorporativo" name="CC_Firma_BDI" file="sharedcert:///CC_MULTI_BANCA_DIGITAL.cer"/>
                <CryptoCertificate domain="Canales" name="CC_Firma_BDI" file="sharedcert:///CC_MULTI_BANCA_DIGITAL.cer"/>
                <CryptoCertificate domain="Integracion" name="CC_Firma_BDI" file="sharedcert:///CC_MULTI_BANCA_DIGITAL.cer"/>
                <CryptoCertificate domain="Productos" name="CC_Firma_BDI" file="sharedcert:///CC_MULTI_BANCA_DIGITAL.cer"/>
                <CryptoCertificate domain="ServiciosExternos" name="CC_Firma_BDI" file="sharedcert:///CC_MULTI_BANCA_DIGITAL.cer"/>
            </CryptoCertificates>
            <Subject>CN=iibawsdllo01.bancadigital.com.co</Subject>
            <CreationDate>2024-01-12T04:36:48Z</CreationDate>
            <ExpirationDate>2025-02-10T05:36:48Z</ExpirationDate>
            <DaysToExpire>160</DaysToExpire>
            <Base64>MIIDyDCCArCgAwIBAgIRAJ</Base64>
        </Certificate>
        <Certificate serial-number="5721767648304231510">
            <CryptoCertificates>
                <CryptoCertificate domain="ApoyoCorporativo" name="CC_Firma_Deceval" file="cert:///CC_Firma_Deceval"/>
                <CryptoCertificate domain="ApoyoCorporativo" name="CC_SSL_DECEVAL" file="cert:///CC_SSL_DECEVAL.crt"/>
            </CryptoCertificates>
            <Subject>CN=certificacion.pagares.bvc.com.co</Subject>
            <CreationDate>2024-02-08T19:41:02Z</CreationDate>
            <ExpirationDate>2025-02-28T23:32:12Z</ExpirationDate>
            <DaysToExpire>179</DaysToExpire>
            <Base64>MIIGzDCCBbSgAwIBAgIIT2fNXGR</Base64>
        </Certificate>
    </Certificates>
</CertificatesInventory>
`;

// Función para parsear el XML y extraer la información
export function procesarXML(xmlData) {
    
    const parser = new xml2js.Parser();

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error("Error al parsear el XML:", err);
            return;
        }

        // Acceder al inventario de certificados
        const inventory = result.CertificatesInventory;
        const appliance = inventory.$.appliance;
        const generated = inventory.$.generated;

        console.log(`Inventario de Certificados para el Appliance: ${appliance}`);
        console.log(`Generado el: ${generated}\n`);

        // Acceder a la lista de certificados
        const certificados = inventory.Certificates[0].Certificate;

        certificados.forEach((cert, index) => {
            const serialNumber = cert.$['serial-number'];
            const subject = cert.Subject[0];
            const creationDate = cert.CreationDate[0];
            const expirationDate = cert.ExpirationDate[0];
            const daysToExpire = cert.DaysToExpire[0];
            const base64 = cert.Base64[0];

            console.log(`Certificado ${index + 1}:`);
            console.log(`  Número de Serie: ${serialNumber}`);
            console.log(`  Subject: ${subject}`);
            console.log(`  Fecha de Creación: ${creationDate}`);
            console.log(`  Fecha de Expiración: ${expirationDate}`);
            console.log(`  Días para Expirar: ${daysToExpire}`);
            console.log(`  Base64: ${base64}\n`);

            // Acceder a los CryptoCertificates
            const cryptoCerts = cert.CryptoCertificates[0].CryptoCertificate;

            console.log(`  CryptoCertificates:`);
            cryptoCerts.forEach((cryptoCert, cIndex) => {
                const domain = cryptoCert.$.domain;
                const name = cryptoCert.$.name;
                const file = cryptoCert.$.file;

                console.log(`    CryptoCertificate ${cIndex + 1}:`);
                console.log(`      Dominio: ${domain}`);
                console.log(`      Nombre: ${name}`);
                console.log(`      Archivo: ${file}`);
            });

            console.log('\n-----------------------------------\n');
        });
    });
}

// Ejecutar la función con el XML proporcionado
// procesarXML(xml);

