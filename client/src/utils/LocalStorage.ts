const setLocalStorage = <T>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
}

const getLocalStorage = (key: string) => {
    try {
        const item = window.localStorage.getItem(key);
        if (item !== 'undefined' && item !== null) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.log(error);
    }
}

const removeLocalStorage = (key: string) => {
    try {
        window.localStorage.removeItem(key);
    } catch(error) {
        console.log(error)
    }
}

const setSessionStorage = <T>(key: string, value: T) => {
    try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
}

const getSessionStorage = (key: string) => {
    try {
        const item = window.sessionStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.log(error);
    }
}

const removeSessionStorage = (key: string) => {
    try {
        window.sessionStorage.removeItem(key);
    } catch(error) {
        console.log(error)
    }
}

export { setLocalStorage, getLocalStorage, removeLocalStorage, setSessionStorage, getSessionStorage, removeSessionStorage };