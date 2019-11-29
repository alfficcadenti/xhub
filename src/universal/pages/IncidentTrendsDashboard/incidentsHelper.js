import moment from 'moment';

const getIncidentsData = (filteredIncidents = []) => {
    return Object.values(filteredIncidents).map((inc) => (
        {
            Incident: inc.incident_number,
            Priority: inc.priority || '',
            Brand: inc.Brand || '',
            Started: moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm'),
            Summary: inc.incident_summary || '',
            Duration: inc.duration || '',
            'Root Cause Owners': inc.Root_Cause_Owner || '',
            Status: inc.Status || ''
        }
    ));
};

const distinct = (value,index,self) => {
    return self.indexOf(value) === index;
}

const getIncDataByBrand = (inc) => {
    const distinctBrands = inc.map(x => x.Brand).filter( distinct )
    return distinctBrands.map(elem => {
        const P1inc = inc.filter(x=>x.priority === "1-Critical").filter(x=>x.Brand===elem).length
        const P2inc = inc.filter(x=>x.priority === "2-High").filter(x=>x.Brand===elem).length
        const total = inc.filter(x=>x.Brand===elem).length
        return {'Brand':elem, 'P1':P1inc, 'P2':P2inc, 'Total': total}
    });
}

export default {
    getIncidentsData,getIncDataByBrand
};
