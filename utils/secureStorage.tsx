import EncryptedStorage from 'react-native-encrypted-storage';


async function storeToStorage(id:any,data:any) {
    try {
    //store json value
        await EncryptedStorage.setItem(
            id,
            JSON.stringify({
                        token : "ACCESS_TOKEN",
                        value : data,
                       
                    })
        );
       
        //store single value
        // await EncryptedStorage.setItem(
        //     id,data);

        // Congrats! You've just stored your first value!
        console.warn("Congrats! You've just stored your first value!");
    } catch (error) {
        console.warn("error at secure storage",error);
        // There was an error on the native side
    }
}


async function retrieveFromStorage(id:any) {
    try {   
        const session = await EncryptedStorage.getItem(id);
    
        if (session !== undefined) {
            // Congrats! You've just retrieved your first value!
            return session;
        }
    } catch (error) {
        // There was an error on the native side
        return null;
    }
       
}

async function removeItemFromStorage(id:any) {
    try {
        await EncryptedStorage.removeItem(id);
        // Congrats! You've just removed your first value!
    } catch (error) {
        // There was an error on the native side
    }
}



async function clearStorage() {
    try {
        await EncryptedStorage.clear();
        // Congrats! You've just cleared the device storage!
    } catch (error) {
        // There was an error on the native side
    }
}


export {storeToStorage,retrieveFromStorage,removeItemFromStorage,clearStorage };
