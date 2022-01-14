const THRESHOLD = {
    high: 99.99,
    medium: 99.5,
};

export const defineColorByValue = (value) => {
    if (!value) {
        return 'rgb(255, 255, 255)';
    } else if (value > THRESHOLD.high) {
        return `rgb(12, 160, 44, ${(value - THRESHOLD.high) / (100 - THRESHOLD.high)})`;
    } else if (value > THRESHOLD.medium) {
        return `rgb(255, 191, 0, ${(value - THRESHOLD.medium) / (THRESHOLD.high - THRESHOLD.medium)})`;
    } else if (value < THRESHOLD.medium) {
        return 'rgb(255, 0, 0)';
    }
    return 'rgb(255, 255, 255)';
};

export const formattedValue = (value) => {
    if (value === 100) {
        return value;
    }
    if (!value) {
        return '';
    }
    return value && parseFloat(value).toPrecision(5);
};