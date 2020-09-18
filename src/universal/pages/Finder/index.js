/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import DatePicker from '../../components/DatePicker/index';
import UniversalSearch from '../../components/UniversalSearch';
import {DATE_FORMAT} from '../../constants';

import {ChangeRequests} from './tabs/index';
import {useFetchCRs} from './hooks';
import {useSelectedBrand, useQueryParamChange, useFetchProductMapping} from '../hooks';
import './styles.less';
import {adjustInputValue} from '../utils';

const startDateDefaultValue = moment().subtract(1, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();

const Finder = (props) => {
    const selectedBrand = props.selectedBrands[0];
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [filteredUniqueCRs, setFilteredUniqueCRs] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [advancedFilter, setAdvancedFilter] = useState([]);

    const [
        isLoading,
        error,
        allUniqueCRs,
        allCRs,
        indexedDataForSuggestions
    ] = useFetchCRs(
        isApplyClicked,
        startDate,
        endDate,
        selectedBrand,
        applyAdvancedFilter,
        setIsApplyClicked
    );
    const productMapping = useFetchProductMapping(startDate, endDate);
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    const applyAdvancedFilter = () => {
        const filterNewFormat = adjustInputValue(advancedFilter);
        let newFilteredCRs = [...allUniqueCRs];
        if (filterNewFormat && filterNewFormat.length) {
            filterNewFormat.forEach((filter) => {
                if (Array.isArray(filter.values) && filter.values[0]) {
                    newFilteredCRs = newFilteredCRs.filter((x) => filter.values.includes(x[filter.key]));
                } else if (filter.values[0]) {
                    newFilteredCRs = newFilteredCRs.filter((x) => x[filter.key] === filter.values);
                }
            });
            setFilteredUniqueCRs(newFilteredCRs);
        } else {
            setFilteredUniqueCRs([...allUniqueCRs]);
        }
    };

    const onFilterChange = (value) => {
        setAdvancedFilter(value);
        setIsDirtyForm(false);
    };

    useEffect(() => {
        applyAdvancedFilter();
    }, [allUniqueCRs, allCRs, selectedBrand, advancedFilter]);

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilteredUniqueCRs([]);
        setIsDirtyForm(true);
    };

    return (
        <div className="change-requests-container">
            <h1 className="page-title">{'Change Finder'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply Dates'}
                </button>
                {!isLoading && (
                    <UniversalSearch
                        suggestions={indexedDataForSuggestions}
                        suggestionMapping={productMapping}
                        onFilterChange={onFilterChange}
                    />
                )}

            </div>
            <LoadingContainer isLoading={isLoading} error={error}>
                <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand}/>
            </LoadingContainer>
        </div>
    );
};

export default Finder;
