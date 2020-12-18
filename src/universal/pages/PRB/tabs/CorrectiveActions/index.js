import React, {useEffect, useState} from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24, CHEVRON_RIGHT__24} from '@homeaway/svg-defs';
import Modal from '@homeaway/react-modal';
import {checkResponse} from '../../../utils';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults';
import LoadingContainer from '../../../../components/LoadingContainer';
import {mapDetails, checkIsRowSelected} from './utils';
import './styles.less';

const CorrectiveActions = ({
    tickets,
    start,
    end,
    statuses,
    initialL1,
    initialL2,
    selectedL1,
    selectedL2,
    onL1Change,
    onL2Change
}) => {
    const dateQuery = `fromDate=${start}&toDate=${end}`;
    const fetchQuery = statuses && statuses.length
        ? `${dateQuery}&${statuses.map(({value}) => `status=${value}`).join('&')}`
        : dateQuery;
    const [l1Data, setL1Data] = useState([]);
    const [l2Data, setL2Data] = useState([]);
    const [detailsData, setDetailsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        setIsLoading(true);
        Promise.all(['l1', 'l2'].map((l) => fetch(`/v1/corrective-actions/business-owner-type/${l}?${fetchQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then(([l1Response, l2Response]) => {
                initData(l1Response, initialL1, setL1Data, onL1Change);
                initData(l2Response, initialL2, setL2Data, onL2Change);
            })
            .catch((err) => {
                setError('Failed to retrieve data. Try refreshing the page. '
                    + 'If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [tickets]);

    const handleRowClick = (row) => {
        if (row) {
            const {businessOwnerType} = row;
            if (businessOwnerType === 'l1') {
                onL1Change(row);
                onL2Change(null);
            } else if (businessOwnerType === 'l2') {
                const found = l2Data.find((d) => d && d.name === row.name);
                onL2Change(found);
            }
        }
    };

    const fetchDetails = (businessOwnerType, businessOwnerValue) => {
        fetch(`/v1/corrective-actions/business-owner-type/${businessOwnerType}/${businessOwnerValue}/details?${fetchQuery}`)
            .then(checkResponse)
            .then((response) => {
                if (response && response.length) {
                    setDetailsData(response.map(mapDetails));
                    setIsModalOpen(true);
                }
            });
    };

    const renderRow = (row) => {
        const {name, businessOwnerType, ticketsCount} = row;
        const isSelected = checkIsRowSelected(businessOwnerType, selectedL1, selectedL2, name);
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
                {businessOwnerType !== 'l3' && (
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
    };

    const handleL2Close = () => {
        onL2Change({name: null, subOrgDetails: []});
    };

    const renderDetailsTable = () => {
        return (
            <DataTable
                title={`Corrective Actions (${detailsData.length} ${detailsData.length === 1 ? 'result' : 'results'})`}
                data={detailsData}
                columns={['ID', 'L1', 'L2', 'L3', 'Assignee', 'Project', 'Summary', 'Status', 'Priority', 'Department', 'Created', 'Resolved', 'Updated']}
                hiddenColumns={['L1', 'L2', 'L3', 'Department']}
                enableColumnDisplaySettings
                enableCSVDownload
                paginated
            />
        );
    };

    const renderL1Table = () => (
        <div className="l1-table">
            <h3>{'L1'}</h3>
            {l1Data.map(renderRow)}
        </div>
    );

    const renderL2Table = () => (
        <div className={`l2-table ${selectedL1 && selectedL1.name ? 'active' : ''}`}>
            <h3>{'L2'}</h3>
            <div
                className="close-btn"
                onClick={handleL1Close}
                onKeyUp={handleL1Close}
                role="button"
                tabIndex="0"
            >
                <SVGIcon usefill markup={CLOSE__24} />
            </div>
            {(selectedL1 || {subOrgDetails: []}).subOrgDetails.map(renderRow)}
        </div>
    );

    const renderL3Table = () => (
        <div className={`l3-table ${selectedL1 && selectedL2 && selectedL2.name ? 'active' : ''}`}>
            <h3>{'L3'}</h3>
            <div
                className="close-btn"
                onClick={handleL2Close}
                onKeyUp={handleL2Close}
                role="button"
                tabIndex="0"
            >
                <SVGIcon usefill markup={CLOSE__24} />
            </div>
            {(selectedL2 || {subOrgDetails: []}).subOrgDetails.map(renderRow)}
        </div>
    );

    const renderTables = () => (
        <>
            {renderL1Table()}
            {renderL2Table()}
            {renderL3Table()}
        </>
    );

    return (
        <div className="corrective-actions-container">
            <LoadingContainer isLoading={isLoading} error={error} className="loading-container">
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
