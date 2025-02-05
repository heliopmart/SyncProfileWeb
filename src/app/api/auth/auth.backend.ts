import cookieService from '@/app/utils/cookie'; // Importe sua classe de gerenciamento de cookies

interface returnInterface{
    token: string,
    expire: string,
    data?: {
        nonce: () => string,
        device: string
    }
}

interface Authinterface{
    token: string|null
    auth: boolean
    data?: {
        nonce: () => string,
        device: string
    }
}

interface DataUserToAuthInterface{
    nonce: () => string,
    device: string
}

export async function AuthBackend(): Promise<returnInterface | null> {
    try {
        const dataUserToAuth= await getDataUserToAuth()

        const response = await fetch("https://syncprofilewebbackend-production.up.railway.app/token/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "nonce": dataUserToAuth.nonce()
            },
            body: JSON.stringify({
                device: dataUserToAuth.device
            })
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            throw new Error(data.error || "Falha na autenticação");
        }

        return {token: data.token, expire: data.expire, data: dataUserToAuth};
    } catch (error) {
        console.error("Erro na autenticação:", error);
        return null;
    }
}

export async function VerifyAuth(token:string|null): Promise<Authinterface> {
    if(!token){
        return {token: null, auth: false}
    }
    
    try {
        const dataUserToAuth= await getDataUserToAuth()

        const response = await fetch("https://syncprofilewebbackend-production.up.railway.app/token/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "nonce": dataUserToAuth.nonce()
            },
            body: JSON.stringify({
                device: dataUserToAuth.device
            })
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            throw new Error(data.error || "Falha na autenticação");
        }

        if(data.refreshed){
            cookieService.setCookie("authToken", data.token);
            cookieService.setCookie("authExpire",new Date().getTime().toString());
        }

        return {token: data.token, auth: data.auth, data: dataUserToAuth};
    } catch (error) {
        console.error("Erro na autenticação:", error);
        return {token: null, auth: false};
    }
}

export async function getDataUserToAuth():Promise<DataUserToAuthInterface>{
    return {nonce: generateNonce, device: await getDeviceHash()}
}

function generateNonce() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(byte => charset[byte % charset.length])
        .join("");
}

async function getDeviceHash() {
    const deviceInfo = {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const deviceString = JSON.stringify(deviceInfo);
    const encoder = new TextEncoder();
    const data = encoder.encode(deviceString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

    return hashHex;
}
