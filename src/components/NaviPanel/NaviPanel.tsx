import { useState, useCallback, useEffect, useMemo } from 'react';
import './NaviPanel.css';
import NaviPanelCard from './NaviPanelCard/NaviPanelCard';
import type { Space } from '../../types/space.types';
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard';
import AddSpaceModal from '../ModalWindows/AddSpace/AddSpaceModal';
import SpacePreviewCard from './SpacePreviewCard/SpacePreviewCard';
import type { SpaceIconTypes } from '../../types/Icons.types';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useSpaces } from '../../contexts/SpacesContext';
import { UIIcons } from '../Icons';

type NaviPanelProps = {
    onSpaceSelect: (space: Space, spaceId: number) => void;
};

const NaviPanel = ({ onSpaceSelect }: NaviPanelProps) => {

    const { isOpen, open, close } = useDisclosure(false, { 
        onOpen: () => { console.log('onOpen') }, 
        onClose: () => { console.log('onClose') } 
    });
    const { spaces } = useSpaces();
    const [spacePreviewIconKey, setSpacePreviewIconKey] = useState<SpaceIconTypes>('HomeIcon');
    const [spacePreviewTitle, setSpacePreviewTitle] = useState<string>('');
    const [spacePreviewDescription, setSpacePreviewDescription] = useState<string>('');
    const { isOpen: isChangable, toggle: toggleChangable } = useDisclosure(false, { 
        onOpen: () => { console.log('visible') }, 
        onClose: () => { console.log('invisible') } 
    });

    const SwapIconComponent = UIIcons['SwapIcon'];

    // Memoize callback to prevent unnecessary re-renders
    const handleSpacePreviewChange = useCallback((space: { name: string; description: string; icon: SpaceIconTypes }) => {
        setSpacePreviewIconKey(space.icon as SpaceIconTypes);
        setSpacePreviewTitle(space.name);
        setSpacePreviewDescription(space.description);
    }, []);

    const sortedSpaces = useMemo(() => {
        return [...spaces].sort((a, b) => {
            const orderA = a.order ?? 0;
            const orderB = b.order ?? 0;
            return orderA - orderB;
        });
    }, [spaces.length]);

    // Select first space's cards when mounted
    useEffect(() => {
        if (sortedSpaces.length > 0) {
            onSpaceSelect(sortedSpaces[0], sortedSpaces[0].id);
        }
    }, []);

    const spaceSelect = useCallback((space: Space, spaceId: number) => {
        onSpaceSelect(space, spaceId);
    }, [onSpaceSelect]);

    return (
        <div
            className={`navi-panel ${isOpen ? 'navi-panel-disabled' : ''}`}
        >
            {/* Display space cards */}
            {sortedSpaces.map((space: Space) => (
                <NaviPanelCard
                    key={space.id}
                    space={space}
                    isChangable={isChangable}
                    onSpaceSelect={spaceSelect}
                    // onTitleChange={(next: string) => dispatch({ type: 'changeSpaceTitle', id: space.id, title: next })}
                    // onOrderChange={(next: number) => dispatch({ type: 'changeSpaceOrder', id: space.id, order: next })}
                />
            ))}

            {isOpen && <SpacePreviewCard iconKey={spacePreviewIconKey} title={spacePreviewTitle} description={spacePreviewDescription} />}

            {/* Button to create new space */}
            <NaviPanelAddCard onOpenModal={open} />
            <button className='change-button button-svg-small' onClick={toggleChangable}>
                <SwapIconComponent size={24} color="white" />
            </button>
            <AddSpaceModal
                isOpen={isOpen}
                onClose={close}
                onspacePreviewChange={handleSpacePreviewChange} />
        </div>
    );
}

export default NaviPanel;