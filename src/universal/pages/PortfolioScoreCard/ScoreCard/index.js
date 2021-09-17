import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {SVGIcon} from '@homeaway/react-svg';
import {CHEVRON_RIGHT__12} from '@homeaway/svg-defs';
import LoadingContainer from '../../../components/LoadingContainer';
import DataTable from '../../../components/DataTable';
import {FETCH_FAILED_MSG} from '../../../constants';
import {checkResponse} from '../../utils';
import TicketDetailsModal from './TicketDetailsModal';
import {mapOrgDetails} from '../utils';
import {
    ORGS,
    L1_ORGS_LABEL,
    SCORECARD_COLUMNS,
    SCORECARD_COLUMNS_INFO,
    SCORECARD_RULES
} from './constants';
import './styles.less';


const ScoreCard = ({start, end, selectedBrand}) => {
    const history = useHistory();
    const {pathname} = useLocation();
    const [data, setData] = useState({});
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [parentOrg, setParentOrg] = useState(L1_ORGS_LABEL);
    const [orgDetails, setOrgDetails] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([L1_ORGS_LABEL]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({priority: 'p1', org: null, level: 'l1'});

    useEffect(() => {
        setIsLoading(true);
        Promise.all(ORGS.map((l) => fetch(`/v1/org-metrics/business-owner-type/${l}?from_date=${start}&to_date=${end}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then(([{data: l1}, {data: l2}, {data: l3}, {data: l4}]) => {
                setData({l1, l2, l3, l4});
                setOrgDetails(l1);
                history.push(`${pathname}?selectedBrand=${selectedBrand}&start=${start}&end=${end}`);
            })
            .catch(() => setError(FETCH_FAILED_MSG))
            .finally(() => setIsLoading(false));
    }, [start, end, selectedBrand, history, pathname]);

    // eslint-disable-next-line complexity
    const handleSelectOrg = (org, businessOwnerType, subOrgDetails) => {
        if (!ORGS.includes(businessOwnerType) || !subOrgDetails?.length) {
            return;
        }
        if (businessOwnerType === ORGS.at(-1)) {
            // If last businessOwnerType (l4), then just return its subOrgDetails
            setOrgDetails(subOrgDetails);
        } else {
            // Need to know if subOrgDetails has its own subOrgDetails for enabling/disabling link purposes
            const subOrgs = (subOrgDetails || []).map((subOrg) => subOrg.name);
            const nextBusinessOwnerType = `l${Number(businessOwnerType[1]) + 1}`;
            const nextOrgDetails = (data[nextBusinessOwnerType] || []).filter((row) => subOrgs.includes(row.name));
            if (!nextOrgDetails.length) {
                return;
            }
            setOrgDetails(nextOrgDetails);
        }
        setParentOrg(org);
        setBreadcrumbs([...breadcrumbs, org]);
    };

    const handleSelectTickets = (count, priority, org, level) => {
        if (count) {
            setModalData({priority, org, level});
            setIsModalOpen(true);
        }
    };

    const handleBreadcrumbClick = (idx) => {
        if (idx === breadcrumbs.length - 1) {
            return;
        }
        setParentOrg(breadcrumbs[idx]);
        setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
        if (idx === 0) {
            setOrgDetails(data.l1);
        } else {
            const breadcrumbOrg = breadcrumbs[idx];
            const subOrgDetails = data[`l${idx}`].find((row) => row.name === breadcrumbOrg).subOrgDetails;
            const subOrgs = (subOrgDetails || []).map((subOrg) => subOrg.name);
            const nextBusinessOwnerType = `l${idx + 1}`;
            const nextOrgDetails = (data[nextBusinessOwnerType] || []).filter((row) => subOrgs.includes(row.name));
            setOrgDetails(nextOrgDetails);
        }
    };

    const renderBreadcrumb = (breadcrumb, idx) => (
        <div className="breadcrumb-container" key={breadcrumb}>
            {idx > 0 && <SVGIcon inlineFlex markup={CHEVRON_RIGHT__12} />}
            <div
                key={breadcrumb}
                role="button"
                tabIndex="0"
                className={`breadcrumb-text ${idx !== breadcrumbs.length - 1 ? 'link' : ''}`}
                onClick={() => handleBreadcrumbClick(idx)}
                onKeyUp={(e) => e.key === 'Enter' && handleBreadcrumbClick(idx)}
            >
                {breadcrumb}
            </div>
        </div>
    );

    return (
        <div className="score-card-container">
            <LoadingContainer isLoading={isLoading} error={error}>
                <div className="breadcrumbs">
                    {breadcrumbs.length > 1 && breadcrumbs.map(renderBreadcrumb)}
                </div>
                <DataTable
                    title={parentOrg}
                    data={orgDetails
                        .map((org) => mapOrgDetails(org, handleSelectOrg, handleSelectTickets))
                        .sort((a, b) => a.org.localeCompare(b.org))}
                    columns={SCORECARD_COLUMNS}
                    rules={SCORECARD_RULES}
                    columnsInfo={SCORECARD_COLUMNS_INFO}
                    enableColumnDisplaySettings
                    enableCSVDownload
                />
                <TicketDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    start={start}
                    end={end}
                    data={modalData}
                />
            </LoadingContainer>
        </div>
    );
};

export default ScoreCard;
