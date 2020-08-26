/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import DatePicker from '../../components/DatePicker/index';
import UniversalSearch from '../../components/UniversalSearch';
import {DATE_FORMAT} from '../../constants';

import {ChangeRequests} from './tabs/index';
import {useFetchCRs} from './hooks';
import {useSelectedBrand, useQueryParamChange} from '../hooks';
import './styles.less';

const startDateDefaultValue = moment().subtract(3, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();

const Finder = (props) => {
    const selectedBrand = props.selectedBrands[0];
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [filteredUniqueCRs, setFilteredUniqueCRs] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [advancedFilter, setAdvancedFilter] = useState({key: '', value: ''});

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
        applyAdvancedFilter,
        setIsApplyClicked
    );
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    const applyAdvancedFilter = () => {
        if (advancedFilter && advancedFilter.value) {
            setFilteredUniqueCRs([...allUniqueCRs].filter((x) => x[advancedFilter.key] === advancedFilter.value));
        } else {
            setFilteredUniqueCRs([...allUniqueCRs]);
        }
    };

    const onFilterChange = useCallback((value) => {
        setAdvancedFilter(value);
        applyAdvancedFilter();
    }, [advancedFilter]);

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
                {isLoading ? '' : <UniversalSearch suggestions={indexedDataForSuggestions} onFilterChange={(selected) => {
                    onFilterChange(selected);
                }}
                />}

            </div>
            <LoadingContainer isLoading={isLoading} error={error}>
                <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand}/>;
            </LoadingContainer>
        </div>
    );
};

export default Finder;
