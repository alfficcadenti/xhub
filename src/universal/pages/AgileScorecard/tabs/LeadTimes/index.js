import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import Modal from '@homeaway/react-modal';
import LoadingContainer from '../../../../components/LoadingContainer';
import LineChartWrapper from '../../../../components/LineChartWrapper';
import DataTable from '../../../../components/DataTable';
import {checkResponse} from '../../../utils';
import {formatLeadTimeData, mapAgileInsight} from '../../utils';
import {AGILE_INSIGHT_COLUMNS} from '../../constants';
import './styles.less';

const LeadTimes = ({teams, from, to}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalError, setModalError] = useState();

    const getSelectedTeams = useCallback(() => teams.filter((x) => x?.checked && x?.name).map((x) => x?.name), [teams]);

    useEffect(() => {
        setIsLoading(true);
        const url = '/v1/score-card/mean-lead-times'
            + `?from_date=${moment(from).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}`
            + `&to_date=${moment(to).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}`
            + `&team_names=${getSelectedTeams()}`;
        fetch(url)
            .then(checkResponse)
            .then((resJson) => setData(resJson))
            .catch(() => setError('Error loading lead times. Try refreshing the page'))
            .finally(setIsLoading(false));
    }, [teams, from, to, getSelectedTeams]);

    const handleDotClick = ({payload}) => {
        setIsModalLoading(true);
        setIsModalOpen(true);
        const url = '/v1/score-card/agile-insights'
            + `?from_date=${moment(payload.openDate).format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}`
            + `&to_date=${moment(payload.openDate).add(1, 'day').format('YYYY-MM-DDTHH:mm:ss.sss[Z]')}`
            + `&team_names=${getSelectedTeams()}`;
        fetch(url)
            .then(checkResponse)
            .then((resJson) => setModalData(resJson))
            .catch(() => setModalError('Error loading agile insights. Try refreshing the page'))
            .finally(() => {
                setIsModalLoading(false);
            });
    };

    const onModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="lead-time-container">
            <LoadingContainer isLoading={isLoading} error={error}>
                {
                    <LineChartWrapper
                        title="Mean Lead Time (hours)"
                        data={formatLeadTimeData(data)}
                        onDotClick={handleDotClick}
                        showDot={false}
                        keys={['Mean Lead Time']}
                        helpText="Daily average lead time (duration between open datetime and last closed datetime)"
                    />
                }
            </LoadingContainer>
            <Modal
                id="lead-time-modal"
                className="lead-time-modal"
                isOpen={isModalOpen}
                onClose={onModalClose}
            >
                <LoadingContainer isLoading={isModalLoading} error={modalError}>
                    <DataTable
                        title={`Agile Insights (${modalData?.length} Result${modalData?.length === 1 ? '' : 's'})`}
                        data={modalData?.map(mapAgileInsight)}
                        columns={AGILE_INSIGHT_COLUMNS}
                        pageSize={10}
                        paginated
                    />
                </LoadingContainer>
            </Modal>
        </div>
    );
};

export default LeadTimes;
