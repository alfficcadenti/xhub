export const check = (array1, array2) => {
    if (array1.length === array2.length) {
        // eslint-disable-next-line no-unused-expressions
        return array1.every(((result) => {
            return array2.includes(result);
        }));
    }
    return false;
};