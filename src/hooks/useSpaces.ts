import { useReducer, useEffect, useCallback } from 'react';
import type { State, Action, Space, Card } from '../types/space.types';
import { saveSpaces, getSpaces } from '../modules/loader';

/**
 * Reducer function for managing spaces state
 */
const spacesReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'loadSpaces':
            return action.state;
        case 'changeSpaceTitle':
            return {
                ...state,
                spaces: state.spaces.map(s => 
                    s.id === action.id ? { ...s, title: action.title } : s
                ),
            };
        case 'changeSpaceOrder':
            return {
                ...state,
                spaces: state.spaces.map(s => 
                    s.id === action.id ? { ...s, order: action.order } : s
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

const initialState: State = { spaces: [] };

/**
 * Custom hook for managing spaces state
 * Handles loading from and saving to localStorage automatically
 * 
 * @returns Object containing spaces state, dispatch function, and helper methods
 */
export const useSpaces = () => {
    const [state, dispatch] = useReducer(spacesReducer, initialState);

    // Load data from localStorage when component mounts
    useEffect(() => {
        const savedSpaces = getSpaces();
        if (savedSpaces && Array.isArray(savedSpaces.spaces)) {
            dispatch({ type: 'loadSpaces', state: savedSpaces });
        }
    }, []);

    // Save data to localStorage whenever state changes
    useEffect(() => {
        if (state.spaces.length > 0 || localStorage.getItem('spaces') !== null) {
            saveSpaces(state);
        }
    }, [state]);

    // Helper function to add a space
    const addSpace = useCallback((space: Omit<Space, 'id'> & { id?: number }) => {
        dispatch({ 
            type: 'addSpace', 
            space: { 
                id: space.id ?? Date.now(), 
                title: space.title, 
                description: space.description, 
                icon: space.icon,
                cards: space.cards ?? [],
                order: space.order
            } 
        });
    }, []);

    // Helper function to remove a space
    const removeSpace = useCallback((id: number) => {
        dispatch({ type: 'removeSpace', id });
    }, []);

    // Helper function to change space title
    const changeSpaceTitle = useCallback((id: number, title: string) => {
        dispatch({ type: 'changeSpaceTitle', id, title });
    }, []);

    // Helper function to change space order
    const changeSpaceOrder = useCallback((id: number, order: number) => {
        dispatch({ type: 'changeSpaceOrder', id, order });
    }, []);

    // Helper function to add a card to a space
    const addCard = useCallback((spaceId: number, card: Card) => {
        dispatch({ type: 'addCard', spaceId, card });
    }, []);

    // Helper function to remove a card from a space
    const removeCard = useCallback((spaceId: number, cardId: number) => {
        dispatch({ type: 'removeCard', spaceId, cardId });
    }, []);

    return {
        spaces: state.spaces,
        dispatch,
        addSpace,
        removeSpace,
        changeSpaceTitle,
        changeSpaceOrder,
        addCard,
        removeCard,
    };
};

