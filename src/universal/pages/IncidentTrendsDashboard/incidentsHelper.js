import moment from 'moment';
import * as h from '../../components/utils/formatDate';
import {DATE_FORMAT} from './constants';
import { isArray } from 'util';

const getIncidentsData = (filteredIncidents = []) => {
    const incidentNewFormat = filteredIncidents.map((inc) => {
        return {
            Incident: incLink(inc.incident_number) || '',
            Priority: inc.priority || '',
            Brand: inc.Brand || '',
            Started: moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm') || '',
            Summary: inc.incident_summary || '',
            Duration: inc.duration ? h.formatDurationForTable(inc.duration) : '',
            'Root Cause Owners': inc.Root_Cause_Owner || '',
            Status: inc.Status || ''
        }
    });
    return incidentNewFormat;
};

const incLink = (incNumber) => (`<a key='${incNumber}link' href='https://expedia.service-now.com/go.do?id=${incNumber}' target='_blank'>${incNumber}</a>`)

const distinct = (value,index,self) => {
    return self.indexOf(value) === index;
}

const listOfBrands = (inc = []) => (inc.map(x => x.Brand).filter( distinct ))

const weeksInterval = (inc = []) => (
    inc.length === 0 || !isArray(inc) ? 
        [] :
        [
            Math.min(...inc.map(x=> moment(x.startedAt).week())), 
            Math.max(...inc.map(x=> moment(x.startedAt).week()))
        ]
)

const brandIncidents = (inc, brand) => (inc.filter(x=>x.Brand===brand))

const incidentsOfTheWeek = (inc, week = '') => (inc.filter(inc => (moment(inc.startedAt).week() === week)))

const incidentsInTimeFrame = (inc, startDate = '', endDate = moment.now) => (
    inc.filter(
        inc => (
            moment(inc.startedAt).format(DATE_FORMAT) >= startDate && 
            moment(inc.startedAt).format(DATE_FORMAT) <= endDate)
        )
)

const getIncMetricsByBrand = (inc = []) => (
    listOfBrands(inc)
        .map(brand => {

            const brandIncidentsList = brandIncidents(inc,brand);
            const brandMTTR = h.formatDurationToHours(mttr(brandIncidentsList));
            const P1inc = brandIncidentsList.filter(x=>x.priority === "1-Critical").length
            const P2inc = brandIncidentsList.filter(x=>x.priority === "2-High").length
            const total = brandIncidentsList.length
            const brandTotalDuration = h.formatDurationToHours(totalDuration(brandIncidentsList))
            return {
                'Brand':brand, 
                'P1':P1inc, 
                'P2':P2inc, 
                'Total': total, 
                "MTTR": brandMTTR, 
                "Total Duration": brandTotalDuration
            }
    })
)

const getMTTRByBrand = (inc = []) => (
    listOfBrands(inc)
        .map(brand => {
            const brandIncidentsList = brandIncidents(inc,brand);
            const brandMTTR = Number(h.formatDurationToH(mttr(brandIncidentsList)));
            return {
                'Brand':brand, 
                "MTTR": brandMTTR, 
            }
    })
)

const listOfIncByBrands = (inc = []) => (
    listOfBrands(inc)
        .map(brand => brandIncidents(inc, brand))
)

const totalDurationByBrand = (inc = []) => (
    listOfIncByBrands(inc)
            .map(x=>{return {
                "Brand":x[0].Brand,
                "totalDuration":totalDuration(x)
                }
            })
)

const totalDuration = (inc = []) => (
    inc.reduce((acc,curr)=>(acc+Number(curr.duration)),0)
)

const mttr = (inc = []) => (totalDuration(inc) / inc.length) || 0 ;

const weeklyMTTRbyBrand = (inc = []) => {
    const weeks = weeksInterval(inc)
    const incsByBrand = listOfIncByBrands(inc)
    return incsByBrand.map(x => {
        const brandName = x[0].Brand
        const weeklyMTTR = []
        let i;
        for (i = weeks[0]; i <= weeks[1] ; i++) {
            weeklyMTTR.push(h.formatDurationToH(mttr(incidentsOfTheWeek(x,i))))
        }
        return { brand: brandName, data: weeklyMTTR}
    })  
}

const range = (start, end) => {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}

const weeklyRange = (start, end) => {
    if(moment(start) >= moment(end)) return [start];
    return [start, ...weeklyRange(moment(start).add(7, 'days').format(DATE_FORMAT), end)];
}

const top5LongestDuration = (inc) => (inc.sort((a,b)=>(Number(b.duration) - Number(a.duration))).slice(0, 5))
const top5ShortestDuration = (inc) => (inc.sort((a,b)=>(Number(a.duration) - Number(b.duration))).slice(0, 5))

export default {
    getIncidentsData,
    getIncMetricsByBrand,
    totalDurationByBrand,
    listOfBrands,
    listOfIncByBrands,
    totalDuration,
    mttr,
    brandIncidents,
    incidentsInTimeFrame,
    getMTTRByBrand,
    weeksInterval,
    incidentsOfTheWeek,
    weeklyMTTRbyBrand,
    range,
    weeklyRange,
    top5LongestDuration,
    top5ShortestDuration
};
