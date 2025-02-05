import {getDataUserToAuth} from '@/app/api/auth/auth.backend'
const handleTranslate = async (token:string|null, text: string, targetLanguage: string):Promise<string> => {
    
    try{
        const dataUserToAuth = await getDataUserToAuth();
    
        if(!dataUserToAuth.device){
            return text;
        }

        const res = await fetch("https://syncprofilewebbackend-production.up.railway.app/azure/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "nonce": `${dataUserToAuth.nonce()}`
            },
            body: JSON.stringify({
                device: dataUserToAuth.device,
                text: text,
                from: "pt",
                to: [targetLanguage == 'br' ? 'pt' : 'en'] 
            })
        });
        const data = await res.json();

        if(!data.status){
            console.error("Error: ", data.message)
            return text
        }

        return data.data[0].translations[0].text
    }catch(error){
        console.error("Error: ", error)
        return text
    }
}


export default handleTranslate;

