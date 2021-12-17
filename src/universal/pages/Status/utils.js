export const compareObjArraysElements = (array1, array2) => JSON.stringify(array1) === JSON.stringify(array2);

export const timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
};