import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const BarChart = () => {
    const [depositData, setDepositData] = useState([]);
    const [sentData, setSentData] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get('http://localhost:4000/api/transactions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Calculate deposits and sent data
                const depositValues = data
                    .filter(transaction => transaction.type === 'deposit')
                    .map(transaction => transaction.amount);

                const sentValues = data
                    .filter(transaction => transaction.type === 'send')
                    .map(transaction => transaction.amount);

                setDepositData(depositValues);
                setSentData(sentValues);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTransactions();
    }, [token]);

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Transaction Overview',
        },
        xAxis: {
            categories: Array.from(
                { length: Math.max(depositData.length, sentData.length) },
                (_, i) => `T${i + 1}`
            ), // Labels based on the number of data points
        },
        yAxis: {
            title: {
                text: null,
            },
            labels: {
                enabled: false,
            },
        },
        series: [
            {
                name: 'Deposit',
                data: depositData,
            },
            {
                name: 'Sent',
                data: sentData,
            },
        ],
    };

    return (
        <section style={{ height: '200px', width: '90%',margin:'auto' }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { height: '100%', width: '100%', margin: 'auto' } }}
            />
        </section>
    );
};

export default BarChart;
