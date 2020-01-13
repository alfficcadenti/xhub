
const distinct = (value,index,self) => {
    return self.indexOf(value) === index;
}

const listOfBrands = (data = []) => (data.map(x => x.brand).filter( distinct ));

const listOfLOB = (data = []) => (data.map(x => x.lineofbusiness).filter( distinct ));

const psrValuesByBrand = (data = [], brand) => (data.filter(x=>x.brand===brand));

const extractDataForPSRChart = (data = [], brand) => (data.filter(x=>x.brand===brand && x.lineofbusiness === 'PSR' && x.interval==='daily'));

const psrValuesByLOB = (data = [], lob) => (data.filter(x=>x.lineofbusiness===lob));

const psrValuesByDate = (data = [], lob) => (data.filter(x=>x.date===lob));

const psrValuesByInterval = (data = [], interval) => (data.filter(x=>x.interval===interval)) 

const findPSRValueByInterval = (data = [], interval) => (data.find(x=>x.interval===interval)) 

const psrDetailsByBrand = (data = [], brand) => (data.filter(x=>x.brand===brand));

const lastPSRAvailableDate = (data = []) => (data.reduce((acc,curr) => {
    return (curr.date > acc) ? curr.date : acc;
},''))

const getPSROnDate = (data = [], date = '') => (data.find(x=>x.date===date))

const formatDataForTable = (data = []) => (
    listOfLOB(data).map(lob => {
        const daily = findPSRValueByInterval(psrValuesByLOB(data, lob),'daily')
        const weekly = findPSRValueByInterval(psrValuesByLOB(data, lob),'weekly')
        const monthly = findPSRValueByInterval(psrValuesByLOB(data, lob),'monthly')
        return {
            'Line Of Business': lob,
            'Last 24 hours': (daily && daily['successPercentage'].toFixed(2)+' %') || '',
            'Last 7 days': (weekly && weekly['successPercentage'].toFixed(2)+' %') || '',
            'Last 28 days': (monthly && monthly['successPercentage'].toFixed(2)+' %') || '',
        }
    })
)

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
    listOfLOB,
    extractDataForPSRChart,
    psrValuesByBrand,
    psrValuesByLOB,
    psrValuesByDate,
    psrValuesByInterval,
    findPSRValueByInterval,
    psrDetailsByBrand,
    lastPSRAvailableDate,
    getPSROnDate,
    formatDataForTable,
    brandLogoFile
};
