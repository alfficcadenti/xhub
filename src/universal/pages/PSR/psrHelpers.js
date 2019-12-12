
const distinct = (value,index,self) => {
    return self.indexOf(value) === index;
}

const listOfBrands = (data = []) => (data.map(x => x.brand).filter( distinct ));

const psrValuesByBrand = (data = [], brand) => (data.filter(x=>x.brand===brand));

const lastPSRAvailableDate = (data = []) => (data.reduce((acc,curr) => {
    return (curr.date > acc) ? curr.date : acc;
},''))

const getPSROnDate = (data = [], date = '') => (data.find(x=>x.date===date))

const brandLogoFile = (brand) => {
    if (brand === 'vrbo' || brand === 'egencia' || brand === 'hcom') {
        try {
            return require(`../../img/logo-${brand}.png`);
        } catch {
            return undefined
        }
    } else {
        return undefined
    }
}

export default {
    listOfBrands,
    psrValuesByBrand,
    lastPSRAvailableDate,
    getPSROnDate,
    brandLogoFile
};
