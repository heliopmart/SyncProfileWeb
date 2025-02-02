import cookieService from '@/app/utils/cookie'; // Importe sua classe de gerenciamento de cookies

interface returnInterface{
    token: string,
    expire: string
}

interface Authinterface{
    token: string|null
    auth: boolean
}

export async function AuthBackend(apiKey: string, secretKey: string): Promise<returnInterface | null> {
    try {
        const response = await fetch("https://syncprofilewebbackend-production.up.railway.app/token/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: apiKey,
                secret: secretKey,
                _TCD: "clientWeb"
            })
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            throw new Error(data.error || "Falha na autenticação");
        }

        return {token: data.token, expire: data.expire};
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
        const response = await fetch("https://syncprofilewebbackend-production.up.railway.app/token/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            throw new Error(data.error || "Falha na autenticação");
        }

        if(data.refreshed){
            cookieService.setCookie("authToken", data.token, {secure: true, httpOnly: true });
            cookieService.setCookie("authExpire",new Date().getTime().toString(), {secure: true, httpOnly: true });
        }

        return {token: data.token, auth: data.auth};
    } catch (error) {
        console.error("Erro na autenticação:", error);
        return {token: null, auth: false};
    }
}

