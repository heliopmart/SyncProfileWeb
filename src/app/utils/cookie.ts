import Cookies from 'js-cookie';

class CookieService {
  getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  setCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
    const now = new Date();
    const expires = new Date(now.getTime() + (90 * 60 * 1000));

    const updatedOptions = { ...options, expires };

    Cookies.set(name, value, updatedOptions);
  }

  removeCookie(name: string) {
    Cookies.remove(name);
  }
}

const cookieService = new CookieService();

export default cookieService;