const Storage = {
  get(key, defaultValue) {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    try {
      return JSON.parse(data);
    } catch (e) {
      // corrupted or non-JSON value (e.g. "undefined") — reset to default
      console.warn(`Storage.get: unable to parse key=${key}, resetting to default`);
      return defaultValue;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
