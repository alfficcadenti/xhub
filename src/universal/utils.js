// eslint-disable-next-line complexity
export const getOrDefault = (item, property, transformFn, transformFnParam) => {
    if (!item || !property || !item[property]) {
        return '-';
    }
    if (transformFn) {
        return transformFn(item[property], transformFnParam) || '-';
    }
    return item[property];
};
