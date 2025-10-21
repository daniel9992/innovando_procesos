import { useState, useCallback } from 'react';
import type { Session } from 'react-router';

interface HistoryState {
    history: Session[];
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
}

export const useSessionHistory = () => {
    const [state, setState] = useState<HistoryState>({
        history: [],
        currentPage: 1,
        totalPages: 1,
        isLoading: false
    });

    const fetchHistory = useCallback(async (page: number) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            // Aquí iría la lógica de obtención del historial
            setState((prev) => ({
                ...prev,
                currentPage: page,
                isLoading: false
            }));
        } catch (error) {
            console.error('Error fetching history:', error);
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    return {
        ...state,
        fetchHistory
    };
};
