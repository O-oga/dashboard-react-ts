import { useEffect, useReducer, useState } from 'react';
import './NaviPanel.css';
import NaviPanelCard from './NaviPanelCard/NaviPanelCard';
import { saveSpaces, getSpaces } from '../../modules/loader';
import type { Space, State, Action } from '../../types/space.types';
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard';
import AddSpaceModal from '../ModalWindows/AddSpace/AddSpace';

type NaviPanelProps = {
    onSpaceSelect?: (cards: Space['cards']) => void;
};

function NaviPanel({ onSpaceSelect }: NaviPanelProps) {
    
    const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);

    function reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'loadSpaces':
                return action.state;
            case 'changeTitle':
                return {
                    ...state,
                    spaces: state.spaces.map(s => s.id === action.id ? { ...s, title: action.title } : s),
                };
            case 'changeOrder':
                return {
                    ...state,
                    spaces: state.spaces.map(s => s.id === action.id ? { ...s, order: action.order } : s),
                };
            case 'add':
                return { ...state, spaces: [...state.spaces, action.space] };
            case 'remove':
                return { ...state, spaces: state.spaces.filter(s => s.id !== action.id) };
            default:
                return state;
        }
    }

    const initialState: State = { spaces: [] };
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load data when component mounts
    useEffect(() => {
        const savedSpaces = getSpaces();
        if (savedSpaces && Array.isArray(savedSpaces.spaces)) {
            dispatch({ type: 'loadSpaces', state: savedSpaces });
        }
    }, []);

    // Save data when state changes
    useEffect(() => {
        if (state.spaces.length > 0 || localStorage.getItem('spaces') !== null) {
            saveSpaces(state);
        }
    }, [state]);

    return (
        <div
            className={`navi-panel ${isAddSpaceModalOpen ? 'navi-panel-disabled' : ''}`}
            style={{
                justifyContent: state.spaces.length === 0 ? 'center' : 'flex-start'
            }}
        >
            {/* Display space cards */}
            {state.spaces.map((space: Space, index: number) => (
                <NaviPanelCard
                    key={space.id || index}
                    icon={space.icon}
                    title={space.title}
                    order={space.order}
                    description={space.description}
                    cards={space.cards}
                    onClick={() => onSpaceSelect?.(space.cards)}
                    onTitleChange={(next: string) => dispatch({ type: 'changeTitle', id: space.id, title: next })}
                    onOrderChange={(next: number) => dispatch({ type: 'changeOrder', id: space.id, order: next })}
                />
            ))}

            {/* Button to create new space */}
            <NaviPanelAddCard onClick={() => setIsAddSpaceModalOpen(true)} />
            <AddSpaceModal isOpen={isAddSpaceModalOpen} onClose={() => setIsAddSpaceModalOpen(false)} />
        </div>
    );
}

export default NaviPanel;