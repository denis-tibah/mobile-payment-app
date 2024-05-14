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
  }>({
    publicKey: "",
    privateKey: "",
    encryptedMessage: "",
    decryptedMessage: "",
  });

  const handleGenerateSignature = ({
    secretMessage,
  }: {
    secretMessage: string;
  }) => {
    rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
      if (err) {
        console.error("Key generation error:", err);
        return;
      }
      const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
      const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

      // Encrypt with public key
      const encryptedMessage = keypair.publicKey.encrypt(
        secretMessage,
        "RSA-OAEP"
      );

      // Decrypt with private key
      const decryptedMessage = keypair.privateKey.decrypt(
        encryptedMessage,
        "RSA-OAEP"
      );

      setSignatureData({
        publicKey,
        privateKey,
        encryptedMessage,
        decryptedMessage,
      });
    });
  };

  return { handleGenerateSignature, signatureData };
}
