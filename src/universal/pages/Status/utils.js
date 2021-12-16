const compareArraysElements = (array1, array2) => (
    Array.isArray(array1) &&
    array1.length === array2.length &&
    array1.every((result) => array2.includes(result)
    ));

// eslint-disable-next-line consistent-return
const compareObj = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every((p) => obj1[p] === obj2[p]);

export const compareObjArraysElements = (array1, array2) => {
    if (!Array.isArray(array1) || array1.length !== array2.length) {
        return false;
    }
    let arraysMatch = false;
    for (let i = 0; i < array1.length; i++) {
        let j = 0;
        while (j < array2.length && arraysMatch === false) {
            if (typeof array1[i] === 'object') {
                if (compareObj(array1[i], array2[j])) {
                    arraysMatch = true;
                }
            } else if (compareArraysElements(array1, array2)) {
                arraysMatch = true;
            }
            j++;
        }
    }
    return arraysMatch;
};

export const timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
};