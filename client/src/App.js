import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Timer from './components/Timer';
import ManualEntry from './components/ManualEntry';
import History from './components/History';
import { TimeProvider } from './context/TimeContext';

function App() {
    return (
        <TimeProvider>
            <Router>
                <div className="App">
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Timer />} />
                            <Route path="/manual" element={<ManualEntry />} />
                            <Route path="/history" element={<History />} />
                        </Routes>
                    </Layout>
                </div>
            </Router>
        </TimeProvider>
    );
}

export default App;