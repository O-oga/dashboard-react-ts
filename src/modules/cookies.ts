/**
 * Утилиты для работы с cookies
 */

/**
 * Устанавливает значение cookie
 * @param name - имя cookie
 * @param value - значение cookie
 * @param days - количество дней до истечения
 */
export const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

/**
 * Получает значение cookie
 * @param name - имя cookie
 * @returns значение cookie или пустая строка
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
 * Удаляет cookie
 * @param name - имя cookie
 */
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

