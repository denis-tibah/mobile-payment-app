import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import forge from "node-forge";
const rsa = forge.pki.rsa;

export default function useDigitalSignature() {
  const [signatureData, setSignatureData] = useState<{
    publicKey: string;
    privateKey: string;
    encryptedMessage: string;
    decryptedMessage: string;
    //pemCert: string;
  }>({
    publicKey: "",
    privateKey: "",
    encryptedMessage: "",
    decryptedMessage: "",
    //pemCert: "",
  });

  // Function to strip the header and footer
  const stripPemFormatting = (pem: any) => {
    return pem
      .replace(/-----BEGIN [\s\S]+?-----/, "")
      .replace(/-----END [\s\S]+?-----/, "")
      .replace(/\r?\n|\r/g, ""); // Remove all newlines
  };

  // Function to encrypt using RSA/ECB/OAEPWithSHA-1AndMGF1Padding and base64 encode
  const encryptRSA = (data: any, publicKeyPem: any) => {
    // Parse RSA public key
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Encrypt using RSA-OAEP with SHA-1 hashing and MGF1 padding
    const encryptedData = publicKey.encrypt(data, "RSA-OAEP", {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create(),
      },
    });

    // Base64 encode the encrypted result
    const base64EncryptedData = forge.util.encode64(encryptedData);

    return base64EncryptedData;
  };

  // Function to decrypt using RSA/ECB/OAEPWithSHA-1AndMGF1Padding
  const decryptRSA = (encryptedData: any, privateKeyPem: any) => {
    // Parse RSA private key
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Convert base64-encoded encrypted data to binary
    const encryptedBinary = forge.util.decode64(encryptedData);

    // Decrypt using RSA-OAEP with SHA-1 hashing and MGF1 padding
    const decryptedData = privateKey.decrypt(encryptedBinary, "RSA-OAEP", {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create(),
      },
    });

    return decryptedData.toString("utf8");
  };

  const handleGenerateSignature = ({
    secretMessage,
  }: {
    secretMessage: string;
  }) => {
    rsa.generateKeyPair({ bits: 1024, workers: 2 }, (err, keypair) => {
      if (err) {
        console.error("Key generation error:", err);
        return;
      }

      // Generate PEM-encoded public and private keys
      const publicKeyWithPadding = forge.pki.publicKeyToPem(keypair.publicKey);
      console.log(
        "🚀 ~ rsa.generateKeyPair ~ publicKeyWithPadding:",
        publicKeyWithPadding
      );
      const privateKeyWithPadding = forge.pki.privateKeyToPem(
        keypair.privateKey
      );
      console.log(
        "🚀 ~ rsa.generateKeyPair ~ privateKeyWithPadding:",
        privateKeyWithPadding
      );

      const publicKey = stripPemFormatting(publicKeyWithPadding);
      const privateKey = stripPemFormatting(privateKeyWithPadding);

      // Create an X.509 certificate
      /* const cert = forge.pki.createCertificate();
      cert.publicKey = keypair.publicKey;
      cert.serialNumber = "01";
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setFullYear(
        cert.validity.notBefore.getFullYear() + 1
      ); */

      // Set certificate attributes (subject and issuer)
      /* const attrs = [
        {
          name: "commonName",
          value: "zazoo.com",
        },
        {
          name: "countryName",
          value: "Cyprus",
        },
        {
          shortName: "ST",
          value: "Nicosia",
        },
        {
          name: "localityName",
          value: "Nicosia",
        },
        {
          name: "organizationName",
          value: "Zazoo Inc.",
        },
        {
          shortName: "OU",
          value: "Zazoo",
        },
      ];
      cert.setSubject(attrs);
      cert.setIssuer(attrs); */

      // Self-sign the certificate
      //cert.sign(keypair.privateKey, forge.md.sha256.create());

      //const pemCert = stripPemFormatting(forge.pki.certificateToPem(cert));

      // Encrypt with public key
      /* const encryptedMessage = keypair.publicKey.encrypt(
        secretMessage,
        "RSA-OAEP"
      ); */

      const encryptedMessage = encryptRSA(secretMessage, publicKey);
      console.log(
        "🚀 ~ rsa.generateKeyPair ~ encryptedMessage:",
        encryptedMessage
      );

      // Decrypt with private key
      /* const decryptedMessage = keypair.privateKey.decrypt(
        encryptedMessage,
        "RSA-OAEP"
      ); */

      const decryptedMessage = decryptRSA(
        encryptedMessage,
        privateKeyWithPadding
      );
      console.log(
        "🚀 ~ rsa.generateKeyPair ~ decryptedMessage:",
        decryptedMessage
      );

      /* const decryptedMessage2 = decryptRSA(
        secretMessage,
        privateKeyWithPadding
      );
 */

      /* setSignatureData({
        publicKey,
        privateKey,
        encryptedMessage: encryptedMessage,
        decryptedMessage: "decryptedMessage",
        //pemCert,
      }); */
    });
  };

  return { handleGenerateSignature, signatureData };
}
