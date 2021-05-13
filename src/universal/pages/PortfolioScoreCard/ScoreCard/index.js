import React, {useEffect, useState} from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {CLOSE__24} from '@homeaway/svg-defs';
import Modal from '@homeaway/react-modal';
import {checkResponse} from '../../utils';
import DataTable from '../../../components/DataTable';
import NoResults from '../../../components/NoResults';
import LoadingContainer from '../../../components/LoadingContainer';
import {mapDetails} from '../utils';
import {OPXHUB_SUPPORT_CHANNEL} from '../../../constants';
import './styles.less';

const ScoreCard = ({
   start,
   end,
   onL1Change,
   onL2Change,
   onL3Change,
   onL4Change,
   isApplyClicked
}) => {
    const dateQuery = `fromDate=${start}&toDate=${end}`;
    const [l1Data, setL1Data] = useState([]);
    const [detailsData, setDetailsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const fetchLData = () => {
        setIsLoading(true);
        fetch(`/v1/org-metrics/business-owner-type/l1?${dateQuery}`)
            .then(checkResponse)
            .then(({data}) => {
                setL1Data(data);
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
                default:
                    onL1Change(null);
                    onL2Change(null);
                    onL3Change(null);
                    onL4Change(null);
                    break;
            }
        }
    };

    const fetchDetails = (subOrgDetails) => {
        setDetailsData(subOrgDetails.map(mapDetails));
        setIsModalOpen(true);
    };

    const renderRow = (row) => {
        const {
            name,
            businessOwnerType,
            correctiveActionsTicketCount,
            p1IncidentCount,
            p2IncidentCount,
            percentIncidentsTtdWithin15MinSlo,
            percentIncidentsTtfWithin15MinSlo,
            percentIncidentsTtkWithin30MinSlo,
            percentIncidentsTtrWithin60MinSlo,
            subOrgDetails
        } = row;

        return (
            <div
                key={`${businessOwnerType}-${name}`}
                className={`l-row ${businessOwnerType}-row`}
            >
                <div
                    className="name"
                    onClick={() => fetchDetails(subOrgDetails)}
                >
                    {name}
                </div>
                <div className="cell-value">
                    <span>{p1IncidentCount}</span>
                </div>
                <div className="cell-value">
                    <span>{p2IncidentCount}</span>
                </div>
                <div className="cell-value">
                    <span>{percentIncidentsTtdWithin15MinSlo}</span>
                </div>
                <div className="cell-value">
                    <span>{percentIncidentsTtfWithin15MinSlo}</span>
                </div>
                <div className="cell-value">
                    <span>{percentIncidentsTtkWithin30MinSlo}</span>
                </div>
                <div className="cell-value">
                    <span>{percentIncidentsTtrWithin60MinSlo}</span>
                </div>
                <div className="cell-value">
                    <span>{correctiveActionsTicketCount}</span>
                </div>
                {/*<div*/}
                {/*    className="count"*/}
                {/*    onClick={() => fetchDetails()}*/}
                {/*    onKeyUp={(e) => e.key === 'Enter' && fetchDetails()}*/}
                {/*    role="button"*/}
                {/*    tabIndex="0"*/}
                {/*>*/}
                {/*    {correctiveActionsTicketCount}*/}
                {/*</div>*/}
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
                title={`L2 Details`}
                data={detailsData}
                columns={['Name', 'P1', 'P2', 'TTD<=15M', 'TTF<=15M', 'TTD<=30M', 'TTR<=30M']}
                enableColumnDisplaySettings
                enableCSVDownload
                paginated
            />
        );
    };

    const renderL1Table = () => (
        <div className="l1-table l-table">
            <h3>{'L1'}</h3>
            <div className={`l-row`}>
                <div className="name">{name}</div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'P1'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'P2'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'TTD<=15M'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'TTF<=15M'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'TTD<=30M'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'TTR<=30M'}</div>
                </div>
                <div className="cell-wrapper">
                    <div className="cell-label">{'Corrective Actions'}</div>
                </div>
            </div>
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
        </>
    );

    return (
        <div className="score-card-container">
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

export default ScoreCard;
