import React, {useState, useEffect} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {PRIORITY_LABELS, PRIORITY_COLORS} from '../constants';
import {formatBarChartData, findAndFormatTicket, mapPriority} from '../utils';

const BarChartPanel = ({title, info, tickets, dataUrl, dataKey}) => {
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [dataError, setDataError] = useState();
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsDataLoading(true);
        setDataError(null);
        fetch(dataUrl)
            .then((d) => d.json())
            .then((response) => {
                const rawData = response.data[dataKey] || {};
                const formattedData = rawData.info && rawData.info.message === 'no data found'
                    ? []
                    : formatBarChartData(rawData);
                setChartData(formattedData);
                setIsDataLoading(false);
            })
            .catch((e) => {
                setChartData([]);
                setDataError(e.message);
                setIsDataLoading(false);
            });
    }, [tickets, dataUrl, dataKey]);

    const getBarClickHandler = (priority) => (selectedBar) => {
        if (selectedBar) {
            const selectedTickets = selectedBar.tickets;
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && mapPriority(details.Priority) === priority);
            setModalData({
                data: ticketDetails,
                description: `Displaying defects with ${priority} priority`
            });
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} cursor="pointer">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {PRIORITY_LABELS.map((p) => <Bar key={p} dataKey={p} stackId="a" fill={PRIORITY_COLORS[p]} onClick={getBarClickHandler(p)} />)}
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <Panel
            title={title}
            isLoading={isDataLoading}
            error={dataError}
            info={info}
            isFixedHeight
        >
            {chartData.length ? renderChart() : <div className="chart-message">{'No Results Found'}</div>}
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default BarChartPanel;
