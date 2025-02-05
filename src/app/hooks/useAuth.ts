import { AuthBackend, VerifyAuth } from "@/app/api/auth/auth.backend";
import cookieService from '@/app/utils/cookie'; // Importe sua classe de gerenciamento de cookies

interface Authinterface {
    token: string | null;
    auth: boolean;
    data?: {
        device: string,
        nonce: () => string
    }
}

interface AuthLoginInterface{
    token: string,
    data?: {
        device: string,
        nonce: () => string
    }
}

let authPromise: Promise<Authinterface> | null = null;

export function useAuth() {

    async function auth(): Promise<Authinterface> {
        if (authPromise) {
            return authPromise;
        }

        const storedToken = cookieService.getCookie("authToken");

        if (storedToken) {
            return await VerifyAuth(storedToken);
        }

        authPromise = new Promise<Authinterface>(async (resolve) => {
            const auth = await login();
            if (auth?.token && auth.data) {
                resolve({ auth: true, token: auth.token, data: auth.data });
            } else {
                resolve({ auth: false, token: null });
            }
            authPromise = null;
        });

        return authPromise;
    }

    async function login(): Promise<AuthLoginInterface | null> {
        const auth = await AuthBackend();

        if (auth?.token && auth.data) {
            cookieService.setCookie("authToken", auth.token);
            return {token: auth.token, data: auth.data}
        } else {
            return null;
        }
    }

    function logout() {
        cookieService.removeCookie("authToken");
    }

    return { login, logout, auth };
}