import React, { useState, useContext, useEffect } from 'react';
import { TimeContext } from '../context/TimeContext';
import { differenceInSeconds, addDays } from 'date-fns';
import { roundDuration } from '../utils';
import './ManualEntry.css';

const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

const ManualEntry = () => {
    const { addManualEntry } = useContext(TimeContext);
    const [startDate, setStartDate] = useState(getLocalDate());
    const [endDate, setEndDate] = useState(getLocalDate());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (startTime && endTime) {
            if (endTime < startTime) {
                if (startDate === endDate) {
                     const nextDay = new Date(startDate);
                     nextDay.setDate(nextDay.getDate() + 1);
                     setEndDate(nextDay.toISOString().split('T')[0]);
                }
            } else {
                const nextDay = new Date(startDate);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                
                if (endDate === nextDayStr) {
                    setEndDate(startDate);
                }
            }
        }
    }, [startTime, endTime, startDate]);

    useEffect(() => {
        if (startTime <= endTime) {
             setEndDate(startDate);
        } else {
             const nextDay = new Date(startDate);
             nextDay.setDate(nextDay.getDate() + 1);
             setEndDate(nextDay.toISOString().split('T')[0]);
        }
    }, [startDate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        const totalSeconds = differenceInSeconds(endDateTime, startDateTime);
        const duration = roundDuration(totalSeconds);

        if (duration <= 0) {
            alert('End time must be after start time.');
            return;
        }

        addManualEntry({
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            duration: duration.toFixed(2),
            notes,
        });
        
        // Reset form
        const today = new Date().toISOString().split('T')[0];
        setDateStates(today);
        setStartTime('09:00');
        setEndTime('17:00');
        setNotes('');
    };

    const setDateStates = (newDate) => {
        setStartDate(newDate);
        setEndDate(newDate);
    }

    const isOvernight = startDate !== endDate;

    return (
        <div className="manual-entry-container">
            <h2>Add Past Entry</h2>
            <form onSubmit={handleSubmit} className="manual-form">
                
                <div className="form-row">
                    <div className="form-group">
                        <label>{isOvernight ? "Start Date" : "Date"}</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </div>
                    {isOvernight && (
                         <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Start Time</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Description"/>
                </div>
                <button type="submit" className="btn secondary">Submit Entry</button>
            </form>
        </div>
    );
};

export default ManualEntry;
