import React from 'react';
import SymptomLineChart from './SymptomLineChart';

const DashboardPage: React.FC = () => {
    return (
    
        <div style={{ display: 'flex', padding: '60px' }}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <h1 style={{ display: 'flex', paddingBottom: '30px' }}>Symptomverlauf über den letzten Monat</h1>
                <div style={{ display: 'flex', padding: '10px' }}>
                <SymptomLineChart />
                </div>
            </div>
            <div style={{ flex: 1, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ display: 'flex', padding: '0px' }}>
                    Heute
                </h1>
                <h1 style={{ display: 'flex', padding: '10px' }}>
                    Hyperaktivitätsscore:
                </h1>
                <br></br>
                <h1 style={{ display: 'flex', padding: '10px' }}>
                    Unaufmerksamkeit:
                </h1>
                <br></br>
                <h1 style={{ display: 'flex', padding: '10px' }}>
                    Impulsivität:
                </h1>
                <br></br>
                <h1 style={{ display: 'flex', padding: '10px' }}>
                    Häufigste Emotion:
                </h1>
                <br></br>
                <h1 style={{ display: 'flex', padding: '10px' }}>
                    Empfelung für den restlichen Tag:
                </h1>
            </div>
        </div>
    );
};

export default DashboardPage;
