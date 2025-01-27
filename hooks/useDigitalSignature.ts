import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import forge from "node-forge";
const rsa = forge.pki.rsa;
const pki = forge.pki;
import { generateKeysInBackground } from "./worker";
import RSA, { Hash } from "react-native-fast-rsa";
RSA.useJSI = true;

export default function useDigitalSignature() {
  const [signatureData, setSignatureData] = useState<{
    publicKeyWithoutPadding: string;
    privateKeyWithPadding: string;
    pemCertificate?: string;
    pemCertificateWithoutPadding?: string;
  }>({
    publicKeyWithoutPadding: "",
    privateKeyWithPadding: "",
    pemCertificate: "",
    pemCertificateWithoutPadding: "",
  });

  // Function to strip the header and footer
  const stripPemFormatting = (pem: any) => {
    return pem
      .replace(/-----BEGIN [\s\S]+?-----/, "")
      .replace(/-----END [\s\S]+?-----/, "")
      .replace(/\r?\n|\r/g, ""); // Remove all newlines
  };

  // test function to get encrypted base64 string
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
  const decryptRsa = async ({
    encryptedData,
    privateKeyPem,
  }: {
    encryptedData: string;
    privateKeyPem: string;
  }) => {
    console.log("decrypting");
    try {
      const decryptedData = await RSA.decryptOAEP(
        encryptedData,
        "",
        Hash.SHA1,
        privateKeyPem
      );
      return decryptedData;
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  };

  const generateSignatureEx = () => {
    rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
      if (err) {
        console.error("Key generation error:", err);
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
          value: "Zazoo",
        },
        {
          name: "organizationName",
          value: "Zazoo",
        },
        {
          shortName: "OU",
          value: "Zazoo",
        },
      ];
      cert.setSubject(attrs);
      cert.setIssuer(attrs);

      // Self-sign the certificate
      cert.sign(keypair.privateKey, forge.md.sha256.create());

      // Generate PEM-encoded public and private keys
      const publicKeyWithPadding = forge.pki.publicKeyToPem(keypair.publicKey);
      const privateKeyWithPadding = forge.pki.privateKeyToPem(
        keypair.privateKey
      );
      const publicKeyWithoutPadding = stripPemFormatting(publicKeyWithPadding);

      // PEM-encoded certificate
      const pemCertificate = forge.pki.certificateToPem(cert);
      const pemCertificateWithoutPadding = stripPemFormatting(pemCertificate);

      setSignatureData({
        publicKeyWithoutPadding,
        privateKeyWithPadding,
        /* pemCertificate,
        pemCertificateWithoutPadding, */
      });
    });
  };

  const generateSignature = async () => {
    try {
      const { publicKeyWithPadding, privateKeyWithPadding, pemCertificate } =
        await generateKeysInBackground(2048, 2);

      setSignatureData({
        publicKeyWithoutPadding: stripPemFormatting(publicKeyWithPadding),
        privateKeyWithPadding,
        pemCertificate,
        pemCertificateWithoutPadding: stripPemFormatting(pemCertificate),
      });
    } catch (error) {
      console.error("Key generation error:", error);
    }
  };

  const convertPublicKeyPKCS1ToPKCS8 = (pkcs1Key: string) => {
    if (!pkcs1Key) return "";
    // Convert PEM encoded PKCS#1 public key to PKCS#8
    const publicKey = forge.pki.publicKeyFromPem(pkcs1Key);
    // convert a Forge public key to PEM-format
    const pem = pki.publicKeyToPem(publicKey);
    return pem;
  };

  return {
    generateSignature,
    signatureData,
    decryptRsa,
    convertPublicKeyPKCS1ToPKCS8,
  };
}
