const cache = {};

export const setCache = (key, value, ttl = 600) => {
    cache[key] = { value, expires: Date.now() + ttl * 1000 };
};

export const getCache = (key) => {
    const item = cache[key];
    if (!item) return null;
    if (Date.now() > item.expires) {
        delete cache[key];
        return null;
    }
    return item.value;
};
