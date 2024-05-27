import forge from "node-forge";

// Function to strip the header and footer
const stripPemFormatting = (pem: any) => {
  return pem
    .replace(/-----BEGIN [\s\S]+?-----/, "")
    .replace(/-----END [\s\S]+?-----/, "")
    .replace(/\r?\n|\r/g, ""); // Remove all newlines
};

export const generateKeysInBackground = (
  bits: number,
  workers: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      forge.pki.rsa.generateKeyPair({ bits, workers }, (err, keypair) => {
        if (err) {
          reject(err);
          return;
        }

        // Create an X.509 certificate
        const cert = forge.pki.createCertificate();
        cert.publicKey = keypair.publicKey;
        cert.serialNumber = "01";
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setMinutes(
          cert.validity.notBefore.getMinutes() + 2
        );

        const attrs = [
          { name: "commonName", value: "zazoo.com" },
          { name: "countryName", value: "Cyprus" },
          { shortName: "ST", value: "Nicosia" },
          { name: "localityName", value: "Zazoo" },
          { name: "organizationName", value: "Zazoo" },
          { shortName: "OU", value: "Zazoo" },
        ];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);

        // Self-sign the certificate
        cert.sign(keypair.privateKey, forge.md.sha256.create());

        // Generate PEM-encoded public and private keys
        const publicKeyWithPadding = forge.pki.publicKeyToPem(
          keypair.publicKey
        );
        const privateKeyWithPadding = forge.pki.privateKeyToPem(
          keypair.privateKey
        );
        const publicKeyWithoutPadding =
          stripPemFormatting(publicKeyWithPadding);

        // PEM-encoded certificate
        const pemCertificate = forge.pki.certificateToPem(cert);
        const pemCertificateWithoutPadding = stripPemFormatting(pemCertificate);

        resolve({
          publicKeyWithPadding,
          privateKeyWithPadding,
          publicKeyWithoutPadding,
          pemCertificate,
          pemCertificateWithoutPadding,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
