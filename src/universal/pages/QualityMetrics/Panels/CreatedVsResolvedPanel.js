import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {formatCreatedVsResolvedData, findAndFormatTicket} from '../utils';

const CreatedVsResolvedPanel = ({title, info, priority, tickets, panelData}) => {
    const {data, isLoading, error, queries} = panelData;
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [hiddenKeys, setHiddenKeys] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const createdDataKey = `Created ${priority}`;
    const resolvedDataKey = `Resolved ${priority}`;

    useEffect(() => {
        setChartData(formatCreatedVsResolvedData(data));
    }, [tickets, data]);

    const getClickHandler = (ticketsKey) => (selected) => {
        if (selected && selected.payload) {
            const selectedTickets = selected.payload[ticketsKey] || [];
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter(({Priority}) => Priority && Priority.includes(priority));
            setModalData({
                data: ticketDetails,
                description: `Displaying ${ticketsKey === 'createdTickets' ? 'created' : 'resolved'} defects with ${priority} priority`,
                columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
            });
            setIsModalOpen(true);
        }
    };

    const handleLegendClick = (e) => {
        if (e && e.dataKey) {
            const nextHiddenBars = {...hiddenKeys};
            nextHiddenBars[e.dataKey] = !hiddenKeys[e.dataKey];
            setHiddenKeys(nextHiddenBars);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <Panel
            key={title}
            title={title}
            info={info}
            queries={queries}
            isLoading={isLoading}
            error={error}
            isFixedHeight
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} cursor="pointer">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend onClick={handleLegendClick} cursor="pointer" />
                    <Line
                        name="Created"
                        hide={hiddenKeys[createdDataKey]}
                        dataKey={createdDataKey}
                        stroke="#3366cc"
                        activeDot={{onClick: getClickHandler('createdTickets')}}
                    />
                    <Line
                        name="Resolved"
                        hide={hiddenKeys[resolvedDataKey]}
                        dataKey={resolvedDataKey}
                        stroke="#109618"
                        activeDot={{onClick: getClickHandler('resolvedTickets')}}
                    />
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
