import moment from 'moment';
import {isNotDuplicate} from '../utils';


const getUniqueLob = (data = []) => (data.map((item) => item.tags.lob).filter(isNotDuplicate));
const getUniqueBrands = (data = []) => (data.map((item) => item.tags.brand).filter(isNotDuplicate));
const getFilters = (data = [], typeOfFilter) => data.filter((item) => item.tag === typeOfFilter).map((item) => item.values);
export const xAxisData = (data = []) => (data.map((item) => moment(item.time).format('MM/DD hh:mm')));
const seriesData = (data = []) => data.map((item) => item.count);
const getBrandFromImpulseMapping = (IMPULSE_MAPPING, globalBrand) =>
    IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrand);

export default {
    xAxisData,
    seriesData,
    getUniqueLob,
    getUniqueBrands,
    getFilters,
    getBrandFromImpulseMapping
};

