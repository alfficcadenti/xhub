export const getFilters = (data = [], typeOfFilter) => data.filter((item) => item.tag === typeOfFilter).map((item) => item.values);
export const getBrandFromImpulseMapping = (IMPULSE_MAPPING, globalBrand) =>
    IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrand);


