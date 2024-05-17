import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import forge from "node-forge";
const rsa = forge.pki.rsa;

export default function useDigitalSignature() {
  const [signatureData, setSignatureData] = useState<{
    publicKeyWithoutPadding: string;
    privateKeyWithPadding: string;
  }>({
    publicKeyWithoutPadding: "",
    privateKeyWithPadding: "",
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
  const decryptRsa = ({
    encryptedData,
    privateKeyPem,
  }: {
    encryptedData: string;
    privateKeyPem: string;
  }) => {
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

  const generateSignature = () => {
    rsa.generateKeyPair({ bits: 1024, workers: 2 }, (err, keypair) => {
      if (err) {
        console.error("Key generation error:", err);
        return;
      }

      // Generate PEM-encoded public and private keys
      const publicKeyWithPadding = forge.pki.publicKeyToPem(keypair.publicKey);
      const privateKeyWithPadding = forge.pki.privateKeyToPem(
        keypair.privateKey
      );
      const publicKeyWithoutPadding = stripPemFormatting(publicKeyWithPadding);

      setSignatureData({
        publicKeyWithoutPadding,
        privateKeyWithPadding,
      });
    });
  };

  return { generateSignature, signatureData, decryptRsa };
}
