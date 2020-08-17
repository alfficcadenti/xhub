import React, {useState, useEffect} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {CHART_COLORS} from '../../../constants';
import {formatBarChartData, getPanelDataUrl} from '../utils';

const OpenDefects = ({portfolios, tickets, brand}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = () => {
        setIsLoading(true);
        setError(null);
        fetch(getPanelDataUrl(portfolios, 'opendefects', brand))
            .then((data) => data.json())
            .then((opendefects) => {
                const rawData = opendefects.data.openDefects;
                const data = formatBarChartData(rawData);
                setChartData(data);
                setIsLoading(false);
            })
            .catch((e) => {
                setChartData([]);
                setError(e.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [portfolios, tickets, brand]);

    const handleBarClick = (selectedBar) => {
        if (selectedBar) {
            const selectedTickets = selectedBar.activePayload[0].payload.tickets;
            const ticketDetails = selectedTickets.map((ticketId) => tickets.find(({Key}) => ticketId === Key));
            setModalData({data: ticketDetails});
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <>
            <Panel
                title="Open Defects"
                isLoading={isLoading}
                error={error}
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', or 'Archived'"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} onClick={handleBarClick} cursor="pointer">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="counts" stackId="a" fill={CHART_COLORS[0]} />
                    </BarChart>
                </ResponsiveContainer>
                <ChartModal
                    title={'Open Defects'}
                    isOpen={isModalOpen}
                    data={modalData}
                    onClose={handleCloseModal}
                />
            </Panel>
        </>
    );
};

export default OpenDefects;
