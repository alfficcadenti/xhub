import React from 'react';
import {BRANDS, EXPEDIA_BRAND, VRBO_BRAND, EGENCIA_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../constants';
import ALL_PAGES from './index';

export const getVisiblePages = (selectedBrands, pages = [...ALL_PAGES]) => {
    return pages.filter(({hidden, brands}) => (
        !hidden && (!brands || brands.filter((brand) => selectedBrands.includes(brand)).length > 0)
    ));
};

export const getPieData = (filteredDefects, property) => {
    const counts = filteredDefects
        .reduce((acc, curr) => {
            const key = curr[property];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});
    return Object.entries(counts).map(([name, value]) => ({name, value}));
};

export const isNotEmptyString = (item) => !!item;

export const isNotDuplicate = (value, index, self) => self.indexOf(value) === index;

export const mapBrandNames = (brandName) => {
    switch (brandName) {
        case 'expedia':
            return EXPEDIA_BRAND;
        case 'vrbo':
            return VRBO_BRAND;
        default:
            return brandName;
    }
};

export const checkResponse = (response) => {
    if (!response.ok || response.error) {
        throw new Error(response);
    }
    return response.json();
};

export const getBrand = (brand, key) => BRANDS.find((b) => brand === b[key]);

export const sortArrayByMostRecentDate = (arr, prop) => arr.sort((a, b) => new Date(b[prop]) - new Date(a[prop]));

// eslint-disable-next-line complexity
export const divisionToBrand = (division = '') => {
    switch (division && division.toUpperCase()) {
        case 'EGENCIA - CONSOLIDATED':
        case 'EGENCIA':
            return EGENCIA_BRAND;
        case 'VRBO':
        case 'HOME AWAY':
            return VRBO_BRAND;
        case 'HOTELS WORLDWIDE (HWW)':
        case 'HCOM':
            return HOTELS_COM_BRAND;
        case 'EXPEDIA PARTNER SERVICES':
        case 'EPS':
            return EXPEDIA_PARTNER_SERVICES_BRAND;
        default:
            return EXPEDIA_BRAND;
    }
};

export const consolidateTicketsById = (tickets) => {
    const results = [];
    const ticketIdSet = new Set();
    // eslint-disable-next-line complexity
    tickets.forEach((ticket) => {
        const {id} = ticket;
        if (ticketIdSet.has(id)) {
            const found = results.find((t) => t.id === id);
            if (found.impactedBrand && ticket.impactedBrand && !found.impactedBrand.split(',').some((b) => ticket.impactedBrand.split(',').includes(b))) {
                found.impactedBrand += `,${ticket.impactedBrand}`;
            }
            if (ticket.divisions && !found.divisions) {
                found.divisions = ticket.divisions;
            } else if (ticket.divisions && ticket.divisions.length) {
                ticket.divisions.forEach((d) => {
                    if (!found.divisions.includes(d)) {
                        found.divisions.push(d);
                    }
                });
            }
            found.estimatedRevenueLoss = `${parseFloat(found.estimatedRevenueLoss) + parseFloat(ticket.estimatedRevenueLoss || 0)}`;
            found.estimatedGrossLoss = `${parseFloat(found.estimatedGrossLoss) + parseFloat(ticket.estimatedGrossLoss || 0)}`;
        } else {
            ticketIdSet.add(id);
            results.push(ticket);
        }
    });
    return results;
};

export const getUniqueByProperty = (element, property) => {
    const group = element.reduce((acc, item) => {
        const id = item[property];
        if (acc[id]) {
            acc[id].push(item);
        } else {
            acc[id] = [item];
        }
        return acc;
    }, {});
    const output = [];
    // eslint-disable-next-line no-unused-vars
    for (let [key, val] of Object.entries(group)) {
        const obj = {...val[0]};
        obj.tag = [val[0].tag];
        for (let i = 1; i < val.length; ++i) {
            obj.tag.push(val[i].tag);
        }
        output.push(obj);
    }
    return output;
};

export const getListOfUniqueProperties = (data = [], prop) => {
    let isArray = false;
    // extract property value from tickets & determine if it's of type array
    const values = data.map((element) => {
        const value = element[prop];
        isArray = isArray || Array.isArray(value);
        return value;
    });
    if (!isArray) {
        // filter empty strings and duplicates
        const list = values.filter((value, index, self) => value && self.indexOf(value) === index);
        list.sort();
        return list;
    }
    // create a set of values and convert to array
    const list = Array.from(values
        .reduce((acc, value) => {
            if (Array.isArray(value)) {
                value.forEach((tag) => tag && acc.add(tag));
            } else if (value) {
                acc.add(value);
            }
            return acc;
        }, new Set()));
    // sort array ignoring case
    list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    return list;
};

export const buildTicketLink = (id = '', brand = '', url = '') => {
    if (url) {
        return (<a href={url} target="_blank">{id}</a>);
    }
    const brandInUppercase = brand && brand.toUpperCase();
    const brandUrl = brandInUppercase === VRBO_BRAND.toUpperCase() ? `https://jira.homeawaycorp.com/browse/${id}` : `https://expedia.service-now.com/go.do?id=${id}`;
    return (<a href={brandUrl} target="_blank">{id}</a>);
};

export const parseDurationToMs = (strDuration = '') => {
    if (typeof strDuration === 'number') {
        return strDuration;
    }
    if (!strDuration || strDuration === '0') {
        return 0;
    }
    const numRegex = new RegExp(/\d+/, 'g');
    const getNumValue = (str) => (
        strDuration.includes(str)
            ? Number.parseInt(numRegex.exec(strDuration)[0], 10)
            : 0
    );
    const days = getNumValue('d');
    const hours = getNumValue('h');
    const minutes = getNumValue('m');
    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
    return totalMinutes * 60000;
};

const getArray = (item) => {
    return Array.isArray(item)
        ? item.filter(isNotEmptyString)
        : (item || '').replace(/\[/g, '').replace(/\]/g, '').replace(/\'/g, '').split(',').filter(isNotEmptyString);
};

export const getImpactedPartners = (partners, lobs = []) => {
    const impactedPartners = getArray(partners);
    const impactedLobs = getArray(lobs);
    if (impactedPartners.length) {
        return impactedLobs.length
            ? impactedPartners.reduce((acc, curr) => acc.concat(impactedLobs.map((l) => `${curr}-${l}`)), []).join(', ')
            : impactedPartners;
    }
    return null;
};

export const mapEpsData = (t) => {
    const result = t;
    result.id = t.incidentNumber || t.id;
    result.brand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.impactedBrand = EXPEDIA_PARTNER_SERVICES_BRAND;
    result.duration = parseDurationToMs(t.duration);
    result.timeToDetect = parseDurationToMs(t.timeToDetect);
    result.timeToResolve = parseDurationToMs(t.timeToResolve);
    result.impactedPartners = getImpactedPartners(t.impactedPartners);
    result.impactedPartnersLobs = getImpactedPartners(t.impactedPartners, t.impactedLobs || []);
    return result;
};
