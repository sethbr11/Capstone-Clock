import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { differenceInSeconds } from 'date-fns';
import { roundDuration } from '../utils'; // Import the new utility

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [currentSessionDuration, setCurrentSessionDuration] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getData();
            setEntries(data);

            if (data.length > 0) {
                const lastEntry = data[data.length - 1];
                if (lastEntry["Entry Type"] === "Timer" && !lastEntry["End Time"]) {
                    setIsClockedIn(true);
                    setStartTime(new Date(lastEntry["Start Time"]));
                } else {
                    setIsClockedIn(false);
                    setStartTime(null);
                }
            }
            calculateTotalHours(data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let interval;
        if (isClockedIn && startTime) {
            interval = setInterval(() => {
                const now = new Date();
                const seconds = differenceInSeconds(now, startTime);
                setCurrentSessionDuration(seconds);
            }, 1000);
        } else {
            setCurrentSessionDuration(0);
        }
        return () => clearInterval(interval);
    }, [isClockedIn, startTime]);

    const calculateTotalHours = (data) => {
        const total = data.reduce((acc, entry) => {
            const hours = parseFloat(entry["Duration (Hours)"]);
            return isNaN(hours) ? acc : acc + hours;
        }, 0);
        setTotalHours(total);
    };

    const clockIn = async () => {
        try {
            const now = new Date();
            await api.clockIn(now.toISOString());
            setStartTime(now);
            setIsClockedIn(true);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to clock in", error);
        }
    };

    const clockOut = async (notes) => {
        try {
            const now = new Date();
            const totalSeconds = startTime ? differenceInSeconds(now, startTime) : 0;
            const duration = roundDuration(totalSeconds);
            await api.clockOut(now.toISOString(), duration.toFixed(2), notes);
            setIsClockedIn(false);
            setStartTime(null);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to clock out", error);
        }
    };
    
    const addManualEntry = async (entry) => {
        try {
            await api.addManualEntry(entry);
            fetchData();
        } catch (error) {
            console.error("Failed to add manual entry", error);
        }
    };
    
    const addLegacyHours = async (legacyHours) => {
        try {
            await api.addLegacyHours(legacyHours);
            fetchData();
        } catch (error) {
            console.error("Failed to add legacy hours", error);
        }
    };

    return (
        <TimeContext.Provider value={{ entries, isClockedIn, startTime, totalHours, currentSessionDuration, loading, clockIn, clockOut, addManualEntry, addLegacyHours, fetchData }}>
            {children}
        </TimeContext.Provider>
    );
};
