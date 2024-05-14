
import {storeToStorage,retrieveFromStorage,removeItemFromStorage,clearStorage } from "./secureStorage"
import {RSA} from 'react-native-rsa-native'; 


const generateKeys = async () => 
{ 
    //4096 Is the key size 
    let keyPair = await RSA.generateKeys(4096)     
    // console.warn("keyPair ",keyPair); 
    return keyPair; 
}


const generateRSASignature = async (message:any,keys:any) =>{  
    //data to be signed  
    let data = message;  
    //Generate key pair  
    // let keyPair = await generateKeys();  
    //Sign the data  
    let signature = await RSA.signWithAlgorithm(data, keys.private,   RSA.SHA512withRSA);   
    console.warn("signature ",signature.toString()); 
    return signature 
}

const verifyMessage= async (signature:any,message:any,keys:any) =>{ 
    const valid = await RSA.verify(signature, message, keys.public)
    // console.warn('verified', valid);
    return valid;  
}

const decryptMessage= async (encodedMessage:any,keys:any) =>{ 
    const message = await RSA.decrypt(encodedMessage, keys.private)
    // console.warn("message  ",message ); 
    return message  
}

const encryptMessage= async (message:any,keys:any) =>{  
    const encodedMessage = await await RSA.encrypt(message, keys.public)
    // console.warn("encodedMessage  ",encodedMessage ); 
    return encodedMessage  
}

const testEncryptDecrypt = async (message:any) =>{ 
  
    console.warn("Original message  ",message ); 
    let keys = await generateKeys(); 

    await storeToStorage("rsa",keys); 
    //  console.warn("resp ", resp);

    let securestorageValue = await retrieveFromStorage("rsa");
    let keyPair= JSON.parse(securestorageValue).value;
    console.warn("keyPair retrieval ",keyPair);

    //Testing Verify
    let signature=await generateRSASignature(message,keyPair); 
    let valid=await verifyMessage(signature,message,keyPair);
    console.warn("verifyMessage  ",valid ); 

    //Testing Encrypt
    let enc= encryptMessage(message,keyPair);
    console.warn("message enc  ",(await enc).toString() ); 
   
    //Testing Decrypt
    let dec=decryptMessage((await enc).toString(),keyPair);
    console.warn("message dec ",(await dec).toString() ); 
   
    await removeItemFromStorage("rsa");

    await clearStorage();
    
    
    
}



export { generateKeys, generateRSASignature,decryptMessage,encryptMessage,verifyMessage,testEncryptDecrypt };