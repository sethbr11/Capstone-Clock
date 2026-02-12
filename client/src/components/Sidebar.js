import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { TimeContext } from '../context/TimeContext';
import { formatDuration } from '../utils';
import { differenceInDays } from 'date-fns';
import './Sidebar.css';

const Sidebar = () => {
    const { totalHours, currentSessionDuration, isClockedIn } = useContext(TimeContext);

    return (
        <div className="sidebar">
            <h1 className="sidebar-header">Capstone Clock</h1>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Timer</NavLink>
                <NavLink to="/manual" className={({ isActive }) => (isActive ? 'active' : '')}>Manual Entry</NavLink>
                <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>History</NavLink>
            </nav>
            <div className="sidebar-footer">
                <div className="total-hours">
                    {(() => {
                        // Constants
                        const GOAL_HOURS = 150;
                        const DEADLINE = new Date('2026-04-09');
                        const now = new Date();

                        // Calculate Current Total
                        const currentSessionHours = currentSessionDuration ? currentSessionDuration / 3600 : 0;
                        const displayTotalHours = totalHours + currentSessionHours;
                        
                        // Format Duration
                        const [hoursStr, minutesStr] = formatDuration(displayTotalHours).split(' ');
                        const minutesVal = minutesStr.replace('m', '');

                        // Calculate Pace
                        const hoursRemaining = GOAL_HOURS - displayTotalHours;
                        const daysRemaining = differenceInDays(DEADLINE, now);
                        const weeksRemaining = daysRemaining / 7;
                        const hoursPerWeek = weeksRemaining > 0 ? hoursRemaining / weeksRemaining : 0;
                        const formattedPace = hoursPerWeek > 0 ? hoursPerWeek.toFixed(1) : "0.0";
                        
                        return (
                            <div className="total-hours-display">
                                <p className="hours-text">
                                    {hoursStr} {minutesVal}
                                    <span className={isClockedIn ? "flash" : ""}>m</span>
                                </p>
                                <p className="pace-text" title={`Goal: ${GOAL_HOURS}h by Apr 9`}>
                                    <strong>Weekly Pace:</strong> {formattedPace} h/week
                                </p>
                            </div>
                        );
                     })()}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
