import React from "react";
import DataTester from "./Components/DataTester";
import SessionDataDisplay from "./Components/SessionDataDisplay";
import DailyChart from "./Components/SessionChart";

const DashboardPage: React.FC = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mt-2 ml-4 text-[rgb(0,14,128)] ">
        Parent Dashboard
      </h1>
      <div className="flex flex-col md:flex-row p-12 space-y-8 md:space-y-0 md:space-x-8 ">
        <div className="flex-1 space-y-4 rounded-xl shadow-xl bg-[rgb(255,255,255)]">
          <div className="p-6">
            <h1 className="text-2xl font-bold">
              Symptomverlauf über den letzten Monat
            </h1>
            <div className="pt-4">
              <DailyChart />
            </div>
            <h1 className="text-xl font-semibold pt-4">Trend:</h1>
            <p className="text-gray-700">
              Die Scores Ihres Kindes und damit die ADHS Symptome werden immer
              geringer. Herzlichen Glückwunsch, Ihr Kind macht beeindruckende
              Fortschritte.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 rounded-xl shadow-xl bg-[rgb(255,255,255)]">
          <div className="flex-col space-y-6 p-6 ">
            <h1 className="text-2xl font-bold">Heute</h1>
            <div>
              <h1 className="text-xl font-semibold">Hyperaktivitätsscore:</h1>
              <p className="text-gray-700">20/100</p>
            </div>
            <div>
              <h1>Unaufmerksamkeit:</h1>
              <p className="text-gray-700">50/100</p>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Impulsivität:</h1>
              <p className="text-gray-700">70/100</p>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Häufigste Emotion:</h1>
              <p className="text-gray-700">Glücklich</p>
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Empfehlung für den restlichen Tag:
              </h1>
              <p className="text-gray-700">
                Ihr Kind ist heute sehr impulsiv. Unsere Empfehlung ist, dass
                Sie mit dem Kind an der frischen Luft Sport machen, damit es
                sich etwas beruhigt und seine Handlungen überlegter und
                konzentrierter ausführt.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SessionDataDisplay />
      <DataTester />
    </div>
  );
};

export default DashboardPage;
