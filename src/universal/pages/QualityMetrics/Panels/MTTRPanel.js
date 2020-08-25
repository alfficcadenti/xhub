import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {PRIORITY_LABELS, PRIORITY_COLORS} from '../constants';
import {formatTTRData, findAndFormatTicket, mapPriority} from '../utils';

const MTTRPanel = ({tickets, dataUrl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const title = 'Mean Time to Resolve per Week';

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setError(null);
            fetch(dataUrl)
                .then((data) => data.json())
                .then((response) => {
                    const rawData = response.data.timetoresolve;
                    const data = rawData.info && rawData.info.message === 'no data found'
                        ? []
                        : formatTTRData(rawData);
                    setChartData(data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    setChartData([]);
                    setError(e.message);
                    setIsLoading(false);
                });
        };
        fetchData();
    }, [tickets, dataUrl]);

    const getClickHandler = (priority) => (selected) => {
        if (selected && selected.payload) {
            const selectedTickets = selected.payload.tickets || [];
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && mapPriority(details.Priority) === priority);
            setModalData({
                data: ticketDetails,
                description: `Displaying defects with ${priority} priority`,
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
            info="Charting defects by their mean time (days) to resolve (bucketed by week). Click line point for more details."
            isLoading={isLoading}
            error={error}
            info="The weekly average amount of days between a ticket's create date and resolve date w.r.t. priority"
            isFullWidth
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} cursor="pointer">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {PRIORITY_LABELS.map((p) => <Line key={p} dataKey={p} stroke={PRIORITY_COLORS[p]} activeDot={{onClick: getClickHandler(p)}} />)}
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

export default MTTRPanel;
