import React, {useEffect, useState} from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24, CHEVRON_RIGHT__24} from '@homeaway/svg-defs';
import Modal from '@homeaway/react-modal';
import {checkResponse} from '../../../utils';
import DataTable from '../../../../components/DataTable';
import LoadingContainer from '../../../../components/LoadingContainer';
import './styles.less';

// eslint-disable-next-line complexity
const CorrectiveActions = ({
    tickets,
    start,
    end,
    initialL1,
    initialL2,
    selectedL1,
    selectedL2,
    onL1Change,
    onL2Change
}) => {
    const [l1Data, setL1Data] = useState([]);
    const [l2Data, setL2Data] = useState([]);
    const [detailsData, setDetailsData] = useState([]);
    const [modalKey, setModalKey] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const dateQuery = `from=${start.toISOString()}&to=${end.toISOString()}`;
        setIsLoading(true);
        Promise.all([
            fetch(`/v1/corrective-actions/business-owner-type/l1?${dateQuery}`),
            fetch(`/v1/corrective-actions/business-owner-type/l2?${dateQuery}`),
            fetch(`/v1/corrective-actions-details?${dateQuery}`),
        ])
            .then((responses) => Promise.all(responses.map(checkResponse)))
            // eslint-disable-next-line complexity
            .then(([l1Response, l2Response, detailsResponse]) => {
                if (l1Response && l1Response.data) {
                    setL1Data(l1Response.data);
                    if (initialL1) {
                        const found = l1Response.data.find(({name}) => name === initialL1);
                        if (found) {
                            onL1Change(found);
                        }
                    }
                } else {
                    throw Error();
                }
                if (l2Response && l2Response.data) {
                    setL2Data(l2Response.data);
                    if (initialL1 && initialL2) {
                        const found = l2Response.data.find(({name}) => name === initialL2);
                        if (found) {
                            onL2Change(found);
                        }
                    }
                } else {
                    throw Error();
                }
                if (detailsResponse) {
                    setDetailsData(detailsResponse);
                } else {
                    throw Error();
                }
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

    // eslint-disable-next-line complexity
    const renderRow = (row) => {
        const {name, businessOwnerType, ticketsCount} = row;
        const isSelected = (businessOwnerType === 'l1' && selectedL1 && selectedL1.name === name)
            || (businessOwnerType === 'l2' && selectedL2 && selectedL2.name === name);
        const handleCountClick = () => {
            setModalKey({
                l1: businessOwnerType === 'l1' ? row : selectedL1,
                l2: businessOwnerType === 'l2' ? row : null,
                l3: businessOwnerType === 'l3' ? row : null,
            });
            setIsModalOpen(true);
        };
        return (
            <div
                key={`${businessOwnerType}-${name}`}
                className={`l-row ${businessOwnerType}-row ${isSelected ? 'selected' : ''}`}
            >
                <div className="name">{name}</div>
                <div
                    className="count"
                    onClick={handleCountClick}
                    onKeyUp={handleCountClick}
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

    // eslint-disable-next-line complexity
    const filterDetails = ({l1, l2, l3}) => (
        (!modalKey.l1 || modalKey.l1.name === l1)
        && (!modalKey.l2 || modalKey.l2.name === l2)
        && (!modalKey.l3 || modalKey.l3.name === l3)
    );

    const renderDetailsTable = () => {
        const data = detailsData
            .filter(filterDetails)
            .map((row) => ({
                ID: <a href={row.url} target="_blank" rel="noop">{row.id}</a>,
                Assignee: row.assignee,
                Project: row.projectName,
                Summary: row.summary,
                Status: row.status,
                Priority: row.priority || '-',
                Department: row.department,
                Created: row.createdDate,
                Resolved: row.resolvedDate || '-',
                Updated: row.updatedDateTime,
            }));
        return (
            <DataTable
                title={`Corrective Actions (${data.length} ${data.length === 1 ? 'result' : 'results'})`}
                data={data}
                columns={['ID', 'L1', 'L2', 'L3', 'Assignee', 'Project', 'Summary', 'Status', 'Priority', 'Department', 'Created', 'Resolved', 'Updated']}
                hiddenColumns={['L1', 'L2', 'L3', 'Department']}
                enableColumnDisplaySettings
                enableCSVDownload
            />
        );
    };

    return (
        <div className="corrective-actions-container">
            <LoadingContainer isLoading={isLoading} error={error} className="loading-container">
                <div className="l1-table">
                    <h3>{'L1'}</h3>
                    {l1Data.map(renderRow)}
                </div>
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
