import React, {useEffect, useState} from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24, CHEVRON_RIGHT__24} from '@homeaway/svg-defs';
import Modal from '@homeaway/react-modal';
import {checkResponse} from '../../../utils';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults';
import LoadingContainer from '../../../../components/LoadingContainer';
import {mapDetails, checkIsRowSelected, filterDetails} from './utils';
import {OPXHUB_SUPPORT_CHANNEL} from '../../../../constants';
import './styles.less';


const CorrectiveActions = ({
    start,
    end,
    statuses,
    initialL1,
    initialL2,
    initialL3,
    initialL4,
    selectedL1,
    selectedL2,
    selectedL3,
    selectedL4,
    onL1Change,
    onL2Change,
    onL3Change,
    onL4Change,
    isApplyClicked
}) => {
    const dateQuery = `fromDate=${start}&toDate=${end}`;
    const fetchQuery = statuses && statuses.length
        ? `${dateQuery}&${statuses.map(({value}) => `status=${value}`).join('&')}`
        : dateQuery;
    const [l1Data, setL1Data] = useState([]);
    const [l2Data, setL2Data] = useState([]);
    const [l3Data, setL3Data] = useState([]);
    const [l4Data, setL4Data] = useState([]);
    const [detailsData, setDetailsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const initData = (response, initialValue, setData, onLChange) => {
        if (!response || !response.data) {
            throw Error();
        }
        setData(response.data);
        if (initialValue) {
            const found = response.data.find(({name}) => name === initialValue);
            onLChange(found);
        }
    };

    const fetchLData = () => {
        setIsLoading(true);
        Promise.all(['l1', 'l2', 'l3', 'l4'].map((l) => fetch(`/v1/corrective-actions/business-owner-type/${l}?${fetchQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then(([l1Response, l2Response, l3Response, l4Response]) => {
                initData(l1Response, initialL1, setL1Data, onL1Change);
                initData(l2Response, initialL2, setL2Data, onL2Change);
                initData(l3Response, initialL3, setL3Data, onL3Change);
                initData(l4Response, initialL4, setL4Data, onL4Change);
            })
            .catch((err) => {
                setError('Failed to retrieve data. Try refreshing the page. '
                    + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchLData();
    }, []);

    useEffect(() => {
        if (isApplyClicked) {
            fetchLData();
        }
    }, [isApplyClicked]);

    // eslint-disable-next-line complexity
    const handleRowClick = (row) => {
        if (row) {
            const findName = (d) => d && d.name === row.name;
            switch (row.businessOwnerType) {
                case 'l1':
                    onL1Change(row);
                    onL2Change(null);
                    onL3Change(null);
                    onL4Change(null);
                    break;
                case 'l2':
                    const found = l2Data.find(findName);
                    onL2Change(found);
                    onL3Change(null);
                    onL4Change(null);
                    break;
                case 'l3':
                    onL3Change(l3Data.find(findName));
                    onL4Change(null);
                    break;
                case 'l4':
                    onL4Change(l4Data.find(findName));
                    break;
                default:
                    onL1Change(null);
                    onL2Change(null);
                    onL3Change(null);
                    onL4Change(null);
                    break;
            }
        }
    };

    const fetchDetails = (businessOwnerType, businessOwnerValue) => {
        fetch(`/v1/corrective-actions-details?${fetchQuery}`)
            .then(checkResponse)
            .then((response) => {
                if (response && response.length) {
                    const filteredReponse = filterDetails(response, businessOwnerType, businessOwnerValue);
                    setDetailsData(filteredReponse.map(mapDetails));
                    setIsModalOpen(true);
                }
            });
    };

    const renderRow = (row) => {
        const {name, businessOwnerType, ticketsCount} = row;
        const isSelected = checkIsRowSelected(businessOwnerType, selectedL1, selectedL2, selectedL3, selectedL4, name);
        return (
            <div
                key={`${businessOwnerType}-${name}`}
                className={`l-row ${businessOwnerType}-row ${isSelected ? 'selected' : ''}`}
            >
                <div className="name">{name}</div>
                <div
                    className="count"
                    onClick={() => fetchDetails(businessOwnerType, name)}
                    onKeyUp={(e) => e.key === 'Enter' && fetchDetails(businessOwnerType, name)}
                    role="button"
                    tabIndex="0"
                >
                    {ticketsCount}
                </div>
                {businessOwnerType !== 'l5' && (
                    <div
                        className="arrow"
                        onClick={() => handleRowClick(row)}
                        onKeyUp={() => handleRowClick(row)}
                        role="button"
                        tabIndex="0"
                    >
                        <SVGIcon usefill markup={CHEVRON_RIGHT__24} />
                    </div>
                )}
            </div>
        );
    };

    const handleL1Close = () => {
        onL1Change({name: null, subOrgDetails: []});
        onL2Change({name: null, subOrgDetails: []});
        onL3Change({name: null, subOrgDetails: []});
        onL4Change({name: null, subOrgDetails: []});
    };

    const handleL2Close = () => {
        onL2Change({name: null, subOrgDetails: []});
        onL3Change({name: null, subOrgDetails: []});
        onL4Change({name: null, subOrgDetails: []});
    };

    const handleL3Close = () => {
        onL3Change({name: null, subOrgDetails: []});
        onL4Change({name: null, subOrgDetails: []});
    };

    const handleL4Close = () => {
        onL4Change({name: null, subOrgDetails: []});
    };

    const renderDetailsTable = () => {
        return (
            <DataTable
                title={`Corrective Actions (${detailsData.length} ${detailsData.length === 1 ? 'result' : 'results'})`}
                data={detailsData}
                columns={['ID', 'L1', 'L2', 'L3', 'L4', 'L5', 'Assignee', 'Project', 'Summary', 'Status', 'Priority', 'Department', 'Created', 'Resolved', 'Updated']}
                hiddenColumns={['L1', 'L2', 'L3', 'L4', 'L5', 'Department']}
                enableColumnDisplaySettings
                enableCSVDownload
                paginated
            />
        );
    };

    const renderL1Table = () => (
        <div className="l1-table l-table">
            <h3>{'L1'}</h3>
            {l1Data.map(renderRow)}
        </div>
    );

    const renderLTable = (title, selectedL, onLClose) => (
        <div className={`${String(title).toLowerCase()}-table l-table sub-table ${selectedL && selectedL.name ? 'active' : ''}`}>
            <h3>{title}</h3>
            <div
                className="close-btn"
                onClick={onLClose}
                onKeyUp={onLClose}
                role="button"
                tabIndex="0"
            >
                <SVGIcon usefill markup={CLOSE__24} />
            </div>
            {(selectedL || {subOrgDetails: []}).subOrgDetails.map(renderRow)}
        </div>
    );

    const renderTables = () => (
        <>
            {renderL1Table()}
            {renderLTable('L2', selectedL1, handleL1Close)}
            {renderLTable('L3', selectedL2, handleL2Close)}
            {renderLTable('L4', selectedL3, handleL3Close)}
            {renderLTable('L5', selectedL4, handleL4Close)}
        </>
    );

    return (
        <div className="corrective-actions-container">
            <LoadingContainer isLoading={isLoading} error={error}>
                {l1Data.length ? renderTables() : <NoResults />}
            </LoadingContainer>
            <Modal
                id="corrective-actions-modal"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title=""
            >
                {renderDetailsTable()}
            </Modal>
        </div>
    );
};

export default CorrectiveActions;
