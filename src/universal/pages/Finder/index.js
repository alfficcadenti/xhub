/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import DatePicker from '../../components/DatePicker/index';
import UniversalSearch from '../../components/UniversalSearch';

import {DATE_FORMAT} from '../../constants';
import {ChangeRequests, ABTests} from './tabs/index';
import {useFetchCRs, useFetchABTests} from './hooks';
import {useSelectedBrand, useQueryParamChange, useFetchProductMapping} from '../hooks';
import './styles.less';
import {adjustInputValue} from '../utils';

const startDateDefaultValue = moment().subtract(1, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();


const navLinks = [
    {
        id: 'сhangeRequests',
        label: 'Change Requests',
        href: '/finder'
    },
    {
        id: 'abTests',
        label: 'A/B Tests',
        href: '/finder'
    }
];

const Finder = (props) => {
    const selectedBrand = props.selectedBrands[0];
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [filteredUniqueCRs, setFilteredUniqueCRs] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [advancedFilter, setAdvancedFilter] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filteredABTests, setFilteredABTests] = useState([]);
    const [currentSuggestions, setCurrentSuggestions] = useState([]);
    const [resetSelection, setResetSelection] = useState(false);

    const [
        isCRsLoading,
        crError,
        allUniqueCRs,
        allCRs,
        changeRequestSuggestions
    ] = useFetchCRs(
        isApplyClicked,
        startDate,
        endDate,
        selectedBrand,
        applyAdvancedFilter,
        setIsApplyClicked
    );

    const [
        isABTestsLoading,
        aBTestsError,
        abTests,
        abTestSuggestions
    ] = useFetchABTests(
        isApplyClicked,
        startDate,
        endDate
    );

    const productMapping = useFetchProductMapping(startDate, endDate);
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    useEffect(() => {
        if (activeIndex === 0) {
            setCurrentSuggestions(changeRequestSuggestions);
            setResetSelection((reset) => !reset);
        } else if (activeIndex === 1) {
            setCurrentSuggestions(abTestSuggestions);
            applyAdvancedFilter();
            setResetSelection((reset) => !reset);
        }
    }, [activeIndex, allUniqueCRs]);


    const applyAdvancedFilter = () => {
        const filterNewFormat = adjustInputValue(advancedFilter);
        const isCRTabSelected = activeIndex === 0;

        const currentItems = isCRTabSelected ? allUniqueCRs : abTests;

        let newFilteredData = [...currentItems];

        if (filterNewFormat && filterNewFormat.length) {
            filterNewFormat.forEach((filter) => {
                if (Array.isArray(filter.values) && filter.values[0]) {
                    newFilteredData = newFilteredData.filter((x) => filter.values.includes(x[filter.key]));
                } else if (filter.values[0]) {
                    newFilteredData = newFilteredData.filter((x) => x[filter.key] === filter.values);
                }
            });

            if (isCRTabSelected) {
                setFilteredUniqueCRs(newFilteredData);
            } else {
                setFilteredABTests(newFilteredData);
            }
        } else if (isCRTabSelected) {
            setFilteredUniqueCRs([...currentItems]);
        } else {
            setFilteredABTests([...currentItems]);
        }
    };

    const onFilterChange = (value) => {
        setAdvancedFilter(value);
        setIsDirtyForm(false);
    };

    useEffect(() => {
        applyAdvancedFilter();
    }, [allCRs, allUniqueCRs, abTests, advancedFilter, selectedBrand]);

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

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand} />;
            case 1:
                return <ABTests filteredABTests={filteredABTests} />;
            default:
                return <ChangeRequests filteredCR={filteredUniqueCRs} selectedBrand={selectedBrand} />;
        }
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
                        setIsDirtyForm(false);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply Dates'}
                </button>
                {!isCRsLoading && (
                    <UniversalSearch
                        suggestions={currentSuggestions}
                        suggestionMapping={productMapping}
                        onFilterChange={onFilterChange}
                        resetSelection={resetSelection}
                    />
                )}

            </div>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isCRsLoading || isABTestsLoading} error={crError || aBTestsError}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default Finder;
