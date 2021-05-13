import React, {useState, useEffect} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import LoadingContainer from '../../components/LoadingContainer';
import {
    DATE_FORMAT
} from '../../constants';
import ScoreCard from './ScoreCard';
import {useFetchTickets} from './hooks';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {
    validDateRange,
    getQueryValues,
    generateUrl
} from './utils';
import './styles.less';


// eslint-disable-next-line complexity
const PortfolioScoreCard = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const history = useHistory();
    const {search} = useLocation();
    const {
        initialStart,
        initialEnd,
        initialCAOrgs
    } = getQueryValues(search);

    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [selectedL1, setSelectedL1] = useState(null);
    const [selectedL2, setSelectedL2] = useState(null);
    const [selectedL3, setSelectedL3] = useState(null);
    const [selectedL4, setSelectedL4] = useState(null);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [isApplyClicked, setIsApplyClicked] = useState(false);

    const [
        isLoading,
        error
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        // eslint-disable-next-line no-use-before-define
        applyFilters,
        setIsApplyClicked
    );
    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const getInitialCAOrg = (selected, l) => (selected || {name: initialCAOrgs[l]});

    const updateHistory = () => history.push(generateUrl(
        selectedBrands,
        startDate,
        endDate,
        getInitialCAOrg(selectedL1, 'l1'),
        getInitialCAOrg(selectedL2, 'l2'),
        getInitialCAOrg(selectedL3, 'l3'),
        getInitialCAOrg(selectedL4, 'l4')
    ));

    function applyFilters() {
        if (!validDateRange(startDate, endDate)) {
            const values = getQueryValues(search);
            setStartDate(values.initialStart);
            setEndDate(values.initialEnd);
        }

        // updateHistory();
        setIsDirtyForm(false);
    }

    useEffect(() => {
        // updateHistory();
    }, [selectedL1, selectedL2, selectedL3, selectedL4]);

    const handleDateRangeChange = ({start, end}) => {
        setStartDate(moment(start).format(DATE_FORMAT));

        if (!!end || (!end && moment(start).isAfter(endDate))) {
            setEndDate(moment(end).format(DATE_FORMAT));
        }

        setIsDirtyForm(true);
    };

    const handleL1Change = (l1) => {
        setSelectedL1(l1);
    };

    const handleL2Change = (l2) => {
        setSelectedL2(l2);
    };

    const handleL3Change = (l3) => {
        setSelectedL3(l3);
    };

    const handleL4Change = (l4) => {
        setSelectedL4(l4);
    };

    const renderFilters = () => {
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(startDate).toDate()}
                    endDate={moment(endDate).toDate()}
                    hidePresets
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
        );
    };

    return (
        <div className="portfolio-score-card-container">
            <h1 className="page-title">{'Portfolio ScoreCard'}</h1>
            {renderFilters()}
            <LoadingContainer isLoading={isLoading} error={error}>
                <ScoreCard
                    start={startDate}
                    end={endDate}
                    onL1Change={handleL1Change}
                    onL2Change={handleL2Change}
                    onL3Change={handleL3Change}
                    onL4Change={handleL4Change}
                    selectedL1={selectedL1}
                    selectedL2={selectedL2}
                    selectedL3={selectedL3}
                    selectedL4={selectedL4}
                    isApplyClicked={isApplyClicked}
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(PortfolioScoreCard);
