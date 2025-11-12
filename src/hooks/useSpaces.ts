import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { State, Action, Space, Card } from '../types/space.types';
import { saveSpaces, getSpaces } from '../modules/loader';

/**
 * Reducer function for managing spaces state
 */
const spacesReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'loadSpaces':
            return action.state;
        case 'changeSpace':
            return {
                ...state,
                spaces: state.spaces.map(s => 
                    s.id === action.space.id ? action.space : s
                ),
            };
        case 'addSpace':
            return { ...state, spaces: [...state.spaces, action.space] };
        case 'removeSpace':
            return { ...state, spaces: state.spaces.filter(s => s.id !== action.id) };
        case 'addCard':
            return { 
                ...state, 
                spaces: state.spaces.map(s => 
                    s.id === action.spaceId 
                        ? { ...s, cards: [...s.cards, action.card] } 
                        : s
                ) 
            };
        case 'removeCard':
            return { 
                ...state, 
                spaces: state.spaces.map(s => 
                    s.id === action.spaceId 
                        ? { ...s, cards: s.cards.filter(c => c.id !== action.cardId) } 
                        : s
                ) 
            };
        default:
            return state;
    }
};

/**
 * Initialize state from localStorage or return empty state
 */
const getInitialState = (): State => {
    const savedSpaces = getSpaces();
    if (savedSpaces && Array.isArray(savedSpaces.spaces)) {
        return savedSpaces;
    }
    return { spaces: [] };
};

/**
 * Custom hook for managing spaces state
 * Handles loading from and saving to localStorage automatically
 * 
 * @returns Object containing spaces state, dispatch function, and helper methods
 */
export const useSpaces = () => {
    const [state, dispatch] = useReducer(spacesReducer, undefined, getInitialState);
    const hasLoadedRef = useRef(false);
    const prevStateRef = useRef<State | null>(null);

    // Save data to localStorage whenever state changes (but not on initial mount)
    useEffect(() => {
        // Skip saving on initial mount
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            prevStateRef.current = state;
            return;
        }

        // Only save if state actually changed
        if (prevStateRef.current && JSON.stringify(prevStateRef.current) !== JSON.stringify(state)) {
            saveSpaces(state);
            prevStateRef.current = state;
        }
    }, [state]);

    // Helper function to add a space
    const addSpace = useCallback((space: Space) => {
        dispatch({ 
            type: 'addSpace', 
            space: { 
                id: space.id, 
                title: space.title, 
                description: space.description, 
                icon: space.icon,
                cards: space.cards ?? [],
                order: space.order
            } 
        });
    }, []);

    const removeSpace = useCallback((id: number) => {
        dispatch({ type: 'removeSpace', id });
    }, []);

    const changeSpace = useCallback((space: Space) => {
        dispatch({ type: 'changeSpace', space });
    }, []);

    const addCard = useCallback((spaceId: number, card: Card) => {
        dispatch({ type: 'addCard', spaceId, card });
    }, []);

    const removeCard = useCallback((spaceId: number, cardId: number) => {
        dispatch({ type: 'removeCard', spaceId, cardId });
    }, []);

    return {
        spaces: state.spaces,
        dispatch,
        addSpace,
        removeSpace,
        changeSpace,
        addCard,
        removeCard,
    };
};

