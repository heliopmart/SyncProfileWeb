import Cookies from 'js-cookie';

class CookieService {
  getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  setCookie(name: string, value: string) {
    Cookies.set(name, value, { secure: true });
  }

  removeCookie(name: string) {
    Cookies.remove(name);
  }
}

const cookieService = new CookieService();

export default cookieService;