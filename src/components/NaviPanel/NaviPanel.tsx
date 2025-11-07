import { useEffect, useReducer, useState } from 'react';
import './NaviPanel.css';
import NaviPanelCard from './NaviPanelCard/NaviPanelCard';
import { saveSpaces, getSpaces } from '../../modules/loader';
import type { Space, State, Action } from '../../types/space.types';
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard';
import AddSpaceModal from '../ModalWindows/AddSpace/AddSpaceModal';
import SpacePreviewCard from './SpacePreviewCard/SpacePreviewCard';
import type { SpaceIconTypes } from '../../types/Icons.types';

type NaviPanelProps = {
    onSpaceSelect?: (cards: Space['cards']) => void;
};

function NaviPanel({ onSpaceSelect }: NaviPanelProps) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [spacePreviewIconKey, setSpacePreviewIconKey] = useState<SpaceIconTypes>('HomeIcon');
    const [spacePreviewTitle, setSpacePreviewTitle] = useState<string>('');
    const [spacePreviewDescription, setSpacePreviewDescription] = useState<string>('');

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
            className={`navi-panel ${isModalOpen ? 'navi-panel-disabled' : ''}`}
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
                    onSpaceSelect={() => onSpaceSelect?.(space.cards)}
                    onTitleChange={(next: string) => dispatch({ type: 'changeTitle', id: space.id, title: next })}
                    onOrderChange={(next: number) => dispatch({ type: 'changeOrder', id: space.id, order: next })}
                />
            ))}

            <SpacePreviewCard iconKey={spacePreviewIconKey} title={spacePreviewTitle} description={spacePreviewDescription} />

            {/* Button to create new space */}
            <NaviPanelAddCard onOpenModal={() => setIsModalOpen(true)} />
            <AddSpaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onspacePreviewChange={(space: { name: string; description: string; icon: SpaceIconTypes}) => {
                    setSpacePreviewIconKey(space.icon as SpaceIconTypes);
                    setSpacePreviewTitle(space.name);
                    setSpacePreviewDescription(space.description);
                }} />
        </div>
    );
}

export default NaviPanel;