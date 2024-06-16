'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1',Hyperaktivität : 30, Unaufmerksamkeit: 45, Impulsivität: 20 },
    { name: 'Week 2', Hyperaktivität: 35, Unaufmerksamkeit: 40, Impulsivität: 25 },
    { name: 'Week 3', Hyperaktivität: 40, Unaufmerksamkeit: 35, Impulsivität: 30 },
    { name: 'Week 4', Hyperaktivität: 45, Unaufmerksamkeit: 30, Impulsivität: 35 },
];

const SymptomLineChart: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Hyperaktivität" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Unaufmerksamkeit" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Impulsivität" stroke="#ff7300" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SymptomLineChart;
