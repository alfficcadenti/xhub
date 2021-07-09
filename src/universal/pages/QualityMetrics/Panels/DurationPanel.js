import React, {useState, useEffect} from 'react';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import DataTable from '../../../components/DataTable';
import {PRIORITY_COLUMN_HEADERS} from '../constants';
import {formatTableData, formatDurationData, processTwoDimensionalIssues} from '../utils';

const DurationPanel = ({title, info, tickets, portfolios, panelData, type}) => {
    const {data, isLoading, error, queries} = panelData;
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleClick = (d, portfolio, priority) => {
            const nextModalData = processTwoDimensionalIssues(tickets, d, portfolio, portfolios, priority);
            nextModalData.columns = ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Time to Resolve', 'Opened'];
            setModalData(nextModalData);
            setIsModalOpen(true);
        };
        const formattedData = panelData?.info?.message === 'no data found'
            ? []
            : formatDurationData(data.portfolioTTRSummaries || []);
        setChartData(formatTableData(formattedData, handleClick, 'Portfolio', type, true));
    }, [tickets, portfolios, panelData, data]);

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
            queries={queries}
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
