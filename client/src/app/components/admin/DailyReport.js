import { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';

import './DailyReport.css';

const DailyReport = ({ orders }) => {
    const options = [
        { name: 'Commandes', value: 'orders' },
        { name: 'Total', value: 'total' }
    ];
    const [selected, setSelected] = useState([options[0]]);

    const data = [];
    orders.forEach(order => {
        const date = new Date(order.creationDateTime);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${day}/${month}/${year}`;
        const existing = data.find(d => d.name === key);
        if (existing) {
            existing.Orders += 1;
            existing.Total += order.total;
        } else {
            data.push({ name: key, Orders: 1, Total: order.total });
        }
    });

    return (
        <div className="daily-report">
            <div className="report-header">
                <label htmlFor="line-chart" className="title">Rapport de ventes</label>
                {/*
                Refer to : https://www.npmjs.com/package/multiselect-react-dropdown
                */}
                <Multiselect
                    options={options}
                    selectedValues={selected}
                    displayValue="name"
                    id="report-select"
                    className="report-select"
                    placeholder=""
                    onSelect={(selectedList, selectedItem) => { setSelected(selectedList) }}
                    onRemove={(selectedList, removedItem) => { setSelected(selectedList) }}
                    style={
                        {
                            chips: {
                                background: '#3f51b5'
                            },
                            multiselectContainer: {
                                color: '#3f51b5',
                            },
                        }
                    }
                />
            </div>
            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                className='line-chart' id='line-chart'>
                { selected.find(s => s.value === 'orders') && <Line type="monotone" dataKey="Orders" stroke="#8884d8" /> }
                { selected.find(s => s.value === 'total') && <Line type="monotone" dataKey="Total" stroke="#82ca9d" /> }
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </div>
    );
}

export default DailyReport;