import { useCallback, useState } from 'react';

interface Suggestion {
    id: string;
    text: string;
    category: string;
}

interface SuggestionsState {
    suggestions: Suggestion[];
    isLoading: boolean;
    error: Error | null;
}

export const useSuggestions = () => {
    const [state, setState] = useState<SuggestionsState>({
        suggestions: [],
        isLoading: false,
        error: null
    });

    const fetchSuggestions = useCallback(async (query: string) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            console.log('query', query);
            // Aquí iría la lógica de obtención de sugerencias
            setState((prev) => ({
                ...prev,
                isLoading: false
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: error as Error,
                isLoading: false
            }));
        }
    }, []);

    return {
        ...state,
        fetchSuggestions
    };
};
