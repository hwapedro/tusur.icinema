export const non$keys = (obj: object) => Object.keys(obj).filter(key => key.indexOf('$') < 0);