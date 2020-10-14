import React, {useState, useEffect} from 'react';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import DataTable from '../../../components/DataTable';
import {PRIORITY_COLUMN_HEADERS} from '../constants';
import {formatTableData, formatDurationData, processTwoDimensionalIssues} from '../utils';

const DurationPanel = ({title, info, tickets, portfolios, dataUrl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(dataUrl)
            .then((data) => data.json())
            .then((response) => {
                const rawData = response.portfolioTTRSummaries;
                const handleClick = (d, portfolio, priority) => {
                    const nextModalData = processTwoDimensionalIssues(tickets, d, portfolio, portfolios, priority);
                    nextModalData.columns = ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Time to Resolve', 'Opened'];
                    setModalData(nextModalData);
                    setIsModalOpen(true);
                };
                const data = rawData.info && rawData.info.message === 'no data found'
                    ? []
                    : formatDurationData(rawData);
                setChartData(formatTableData(data, handleClick, 'Portfolio', true));
                setIsLoading(false);
            })
            .catch((e) => {
                setChartData([]);
                setError(e.message);
                setIsLoading(false);
            });
    }, [tickets, portfolios, dataUrl]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const renderTableFooter = (items = []) => (
        <div className="table-footer">
            <p className="text-left float-left">
                {'Grouped by: Priority'}
            </p>
            <p className="text-right float-right">
                {`Showing ${items.length - 1} of ${items.length - 1} statistics`}
            </p>
        </div>
    );

    return (
        <Panel
            title={title}
            info={info}
            isLoading={isLoading}
            error={error}
            isFullWidth
        >
            <DataTable
                data={chartData}
                columns={['Portfolio', 'p1', 'p2', 'p3', 'p4', 'p5', 'totalTickets']}
                columnHeaders={PRIORITY_COLUMN_HEADERS}
                className="table-container"
                sortDisabled
                columnIcons
                renderFooter={renderTableFooter}
            />
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default DurationPanel;
