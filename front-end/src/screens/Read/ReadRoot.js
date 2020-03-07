import React from 'react';
import {Route} from 'react-router-dom';
import HistoricalTable from "../../components/Read/ReadTable/Type/HistoricalTable";
import ReadSolveTable from "../../components/Read/ReadTable/Type/ReadSolveTable";

export const ReadRoot = [
    <Route path = '/VohReport/records/' exact component={ReadSolveTable}/>,
    <Route path = '/VohReport/records/read' render={() => <HistoricalTable status='solved'/> } />,
    <Route path = '/VohReport/records/unread' render={() => <HistoricalTable status='unread'/> } />
];