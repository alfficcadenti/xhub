import React, {useState, useEffect} from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {mapPriority, findAndFormatTicket} from '../utils';
import {CHART_COLORS} from '../../../constants';

const PiePanel = ({title, tickets, groupBy}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setError(null);
            const getGroupKey = groupBy === 'Priority'
                ? (ticket) => mapPriority(ticket.priority) || '-'
                : (ticket) => ticket.defectNumber.split('-')[0];
            const counter = {};
            Object.values(tickets.portfolioTickets || {})
                .forEach((portfolioTickets) => {
                    Object.values(portfolioTickets).forEach((ticketDetail) => {
                        const groupKey = getGroupKey(ticketDetail);
                        if (!counter[groupKey]) {
                            counter[groupKey] = {counts: 0, tickets: []};
                        }
                        counter[groupKey].counts++;
                        counter[groupKey].tickets.push(ticketDetail.defectNumber);
                    });
                });
            const data = Object.entries(counter)
                .map(([name, stats]) => ({name, counts: stats.counts, tickets: stats.tickets}));
            setChartData(data);
            setIsLoading(false);
        };
        fetchData();
    }, [tickets, groupBy]);

    const getClickHandler = (cellName, cellTickets) => () => {
        const getGroupKey = groupBy === 'Priority'
            ? (ticket) => mapPriority(ticket.Priority) || '-'
            : (ticket) => ticket.id.split('-')[0];
        const ticketDetails = cellTickets
            .map((ticketId) => findAndFormatTicket(tickets, ticketId))
            .filter((details) => details && getGroupKey(details) === cellName);
        setModalData({
            data: ticketDetails,
            description: `Displaying open bugs with ${groupBy === 'Priority' ? 'priority' : 'project'} ${cellName}`,
            columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <Panel title={title} isLoading={isLoading} error={error}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart cursor="pointer">
                    <Tooltip />
                    <Legend />
                    <Pie data={chartData} dataKey="counts" outerRadius={100}>
                        {chartData.map((cell, idx) => <Cell key={cell.name} fill={CHART_COLORS[idx]} onClick={getClickHandler(cell.name, cell.tickets)} />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default PiePanel;
