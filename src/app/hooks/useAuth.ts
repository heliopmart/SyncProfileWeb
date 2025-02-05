import { AuthBackend, VerifyAuth } from "@/app/api/auth/auth.backend";
import cookieService from '@/app/utils/cookie'; // Importe sua classe de gerenciamento de cookies

interface Authinterface {
    token: string | null;
    auth: boolean;
}

let authPromise: Promise<Authinterface> | null = null;

export function useAuth() {

    async function auth(): Promise<Authinterface> {
        if (authPromise) {
            return authPromise;
        }

        const storedToken = cookieService.getCookie("authToken");

        if (storedToken) {
            const verify = await VerifyAuth(storedToken);
            return verify;
        }

        authPromise = new Promise<Authinterface>(async (resolve) => {
            const token = await login();
            if (token) {
                resolve({ auth: true, token });
            } else {
                resolve({ auth: false, token: null });
            }
            authPromise = null;
        });

        return authPromise;
    }

    async function login(): Promise<string | null> {
        const authToken = await AuthBackend();

        if (authToken) {
            cookieService.setCookie("authToken", authToken.token);
            return authToken.token;
        } else {
            return null;
        }
    }

    function logout() {
        cookieService.removeCookie("authToken");
    }

    return { login, logout, auth };
}