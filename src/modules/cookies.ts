/**
 * Utilities for working with cookies
 */

/**
 * Sets a cookie value
 * @param name - cookie name
 * @param value - cookie value
 * @param days - number of days until expiration
 */
export const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

/**
 * Gets a cookie value
 * @param name - cookie name
 * @returns cookie value or empty string
 */
export const getCookie = (name: string): string => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return '';
};

/**
 * Deletes a cookie
 * @param name - cookie name
 */
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

