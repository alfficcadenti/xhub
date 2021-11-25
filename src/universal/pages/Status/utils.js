export const compareArraysElements = (array1, array2) => (
    Array.isArray(array1) &&
    array1.length === array2.length &&
    array1.every((result) => array2.includes(result)
    ));

export const timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
};