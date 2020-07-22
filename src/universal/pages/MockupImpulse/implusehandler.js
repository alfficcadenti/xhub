import moment from 'moment';


const unique = (value, index, self) => {
    return self.indexOf(value) === index;
};
const getUniqueLob = (data = []) => (data.map((item) => item.tags.lob).filter(unique));
const getUniqueBrands = (data = []) => (data.map((item) => item.tags.brand).filter(unique));
export const xAxisData = (data = []) => (data.map((item) => moment(item.time).format('MM/DD hh:mm')));
export const bookingData = (data = []) => (data.map((item) => item.fields.actualCount));
export const predictionData = (data = []) => (data.map((item) => item.fields.predictedCount));
export const upperBandData = (data = []) => (data.map((item) => item.fields.upperBand));
export const lowerBandData = (data = []) => (data.map((item) => item.fields.lowerBand));
const seriesData = (data = []) => data.map((item) => item.count);

const seriesArray = (data = []) => {
    const actualRevenue = [];
    const predictedRevenue = [];

    for (let i = 0; i < data.length; i++) {
        let obj = data[i];

        actualRevenue.push(obj.fields.actualRevenue);
        predictedRevenue.push(obj.fields.predictedRevenue);
    }
    return [actualRevenue, predictedRevenue];
};

export default {
    xAxisData,
    seriesArray,
    seriesData,
    getUniqueLob,
    getUniqueBrands,
    bookingData,
    predictionData,
    upperBandData,
    lowerBandData
};

