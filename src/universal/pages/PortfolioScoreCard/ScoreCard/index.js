import React, {useEffect, useState} from 'react';
import Modal from '@homeaway/react-modal';
import {checkResponse} from '../../utils';
import DataTable from '../../../components/DataTable';
import NoResults from '../../../components/NoResults';
import LoadingContainer from '../../../components/LoadingContainer';
import {mapDetails, detectThreshold, doesHaveSubOrgs, getCurrentSubOrgDetails} from '../utils';
import {OPXHUB_SUPPORT_CHANNEL} from '../../../constants';
import './styles.less';


const ScoreCard = ({
    start,
    end,
    isApplyClicked
}) => {
    const dateQuery = `fromDate=${start}&toDate=${end}`;
    const [l1Data, setL1Data] = useState([]);
    const [l2Data, setL2Data] = useState([]);
    const [l3Data, setL3Data] = useState([]);
    const [l4Data, setL4Data] = useState([]);
    const [detailsData, setDetailsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClickedOrg, setCurrentClickedOrg] = useState('');
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [currentL, setCurrentL] = useState('');

    const fetchLData = () => {
        setIsLoading(true);

        Promise.all(['l1', 'l2', 'l3', 'l4'].map((l) => fetch(`/v1/org-metrics/business-owner-type/${l}?${dateQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then(([
                {data: l1Response},
                {data: l2Response},
                {data: l3Response},
                {data: l4Response}
            ]) => {
                setL1Data(l1Response);
                setL2Data(l2Response);
                setL3Data(l3Response);
                setL4Data(l4Response);
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

    const showDetails = (subOrgDetails, name, businessOwnerType) => {
        const details = subOrgDetails.map((detail) => {
            return {
                isDisabled: !doesHaveSubOrgs(detail.name, businessOwnerType, l2Data, l3Data, l4Data),
                subOrgDetails: getCurrentSubOrgDetails(detail.name, businessOwnerType, l2Data, l3Data, l4Data),
                showDetails,
                ...detail
            };
        });

        setDetailsData(details.map(mapDetails));
        setIsModalOpen(true);
        setCurrentClickedOrg(name);
        setCurrentL(businessOwnerType.toUpperCase());
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
                className="score-card-row"
            >
                <div
                    className={`name ${!subOrgDetails.length ? 'disabled' : ''}`}
                    onClick={() => showDetails(subOrgDetails, name, businessOwnerType)}
                >
                    {name}
                </div>
                <div className="cell-value">
                    <span>{p1IncidentCount}</span>
                </div>
                <div className="cell-value">
                    <span>{p2IncidentCount}</span>
                </div>
                <div className={`cell-value ${detectThreshold(percentIncidentsTtdWithin15MinSlo)}`}>
                    <span>{`${percentIncidentsTtdWithin15MinSlo}%`}</span>
                </div>
                <div className={`cell-value ${detectThreshold(percentIncidentsTtfWithin15MinSlo)}`}>
                    <span>{`${percentIncidentsTtfWithin15MinSlo}%`}</span>
                </div>
                <div className={`cell-value ${detectThreshold(percentIncidentsTtkWithin30MinSlo)}`}>
                    <span>{`${percentIncidentsTtkWithin30MinSlo}%`}</span>
                </div>
                <div className={`cell-value ${detectThreshold(percentIncidentsTtrWithin60MinSlo)}`}>
                    <span>{`${percentIncidentsTtrWithin60MinSlo}%`}</span>
                </div>
                <div className="cell-value">
                    <span>{correctiveActionsTicketCount}</span>
                </div>
            </div>
        );
    };

    const renderL1Table = () => (
        <div className="score-card-table">
            <h3>{'L1'}</h3>
            <div className="score-card-row">
                <div className="name">{name}</div>
                <div className="header-label">
                    <span>{'P1'}</span>
                </div>
                <div className="header-label">
                    <span>{'P2'}</span>
                </div>
                <div className="header-label">
                    <span>{'TTD<=15M'}</span>
                </div>
                <div className="header-label">
                    <span>{'TTF<=15M'}</span>
                </div>
                <div className="header-label">
                    <span>{'TTK<=30M'}</span>
                </div>
                <div className="header-label">
                    <span>{'TTR<=30M'}</span>
                </div>
                <div className="header-label">
                    <span>{'Corrective Actions'}</span>
                </div>
            </div>
            {l1Data.map(renderRow)}
        </div>
    );


    const getNextL = (currentySelectedL) => {
        const currentLDigit = currentySelectedL.split('')[1];
        return `L${parseInt(currentLDigit, 10) + 1}`;
    };

    return (
        <div className="score-card-container">
            <LoadingContainer isLoading={isLoading} error={error}>
                {l1Data.length ? renderL1Table() : <NoResults />}
            </LoadingContainer>
            <Modal
                id="corrective-actions-modal"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title=""
            >
                <DataTable
                    title={`${getNextL(currentL)} Details (${currentL} - ${currentClickedOrg})`}
                    data={detailsData}
                    columns={['Name', 'P1', 'P2', 'TTD<=15M', 'TTF<=15M', 'TTK<=30M', 'TTR<=30M']}
                    enableColumnDisplaySettings
                    enableCSVDownload
                    paginated
                />
            </Modal>
        </div>
    );
};

export default ScoreCard;
