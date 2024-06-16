import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', Symptom1: 30, Symptom2: 45, Symptom3: 20 },
    { name: 'Week 2', Symptom1: 35, Symptom2: 40, Symptom3: 25 },
    { name: 'Week 3', Symptom1: 40, Symptom2: 35, Symptom3: 30 },
    { name: 'Week 4', Symptom1: 45, Symptom2: 30, Symptom3: 35 },
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
                <Line type="monotone" dataKey="Symptom1" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Symptom2" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Symptom3" stroke="#ff7300" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SymptomLineChart;
