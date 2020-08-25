import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {CHART_COLORS} from '../../../constants';
import {formatCreatedVsResolvedData, findAndFormatTicket, mapPriority} from '../utils';

const CreatedVsResolvedPanel = ({title, info, tickets, data, isLoading, error, priorities}) => {
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setChartData(formatCreatedVsResolvedData(data, priorities));
    }, [tickets, data, priorities]);

    const getClickHandler = (ticketsKey) => (selected) => {
        if (selected && selected.payload) {
            const selectedTickets = selected.payload[ticketsKey] || [];
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && (!priorities || priorities.includes(mapPriority(details.Priority))));
            setModalData({
                data: ticketDetails,
                description: 'Displaying created and resolved defects',
                columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
            });
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <Panel
            title={title}
            info={info}
            isLoading={isLoading}
            error={error}
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} cursor="pointer">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="created" stroke={CHART_COLORS[4]} activeDot={{onClick: getClickHandler('createdTickets')}} />
                    <Line dataKey="resolved" stroke={CHART_COLORS[5]} activeDot={{onClick: getClickHandler('resolvedTickets')}} />
                </LineChart>
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

export default CreatedVsResolvedPanel;
