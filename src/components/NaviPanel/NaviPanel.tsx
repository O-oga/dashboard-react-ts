import { useState, useCallback, useEffect } from 'react';
import './NaviPanel.css';
import NaviPanelCard from './NaviPanelCard/NaviPanelCard';
import type { Space } from '../../types/space.types';
import NaviPanelAddCard from './NaviPanelAddCard/NaviPanelAddCard';
import AddSpaceModal from '../ModalWindows/AddSpace/AddSpaceModal';
import SpacePreviewCard from './SpacePreviewCard/SpacePreviewCard';
import type { SpaceIconTypes } from '../../types/Icons.types';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useSpaces } from '../../hooks/useSpaces';
import { SpacesIcons, UIIcons } from '../Icons';

type NaviPanelProps = {
    onSpaceSelect: (cards: Space['cards']) => void;
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
    const { isOpen: isChangable, open: makeChangable, close: makeInchangable, toggle: toggleChangable } = useDisclosure(false, { 
        onOpen: () => { console.log('visible') }, 
        onClose: () => { console.log('invisible') } 
    });

    const SettingsIconComponent = UIIcons['SettingsIcon'];

    // Memoize callback to prevent unnecessary re-renders
    const handleSpacePreviewChange = useCallback((space: { name: string; description: string; icon: SpaceIconTypes }) => {
        setSpacePreviewIconKey(space.icon as SpaceIconTypes);
        setSpacePreviewTitle(space.name);
        setSpacePreviewDescription(space.description);
    }, []);

    useEffect(() => {
        onSpaceSelect(spaces[0]?.cards ?? []);
    }, []);

    return (
        <div
            className={`navi-panel ${isOpen ? 'navi-panel-disabled' : ''}`}
            style={{
                justifyContent: spaces.length === 0 ? 'center' : 'flex-start'
            }}
        >
            {/* Display space cards */}
            {spaces.map((space: Space, index: number) => {
                return (
                    <NaviPanelCard
                        key={space.id}
                        space={space}
                        isChangable={isChangable}
                        onSpaceSelect={() => onSpaceSelect?.(space.cards)}
                        // onTitleChange={(next: string) => dispatch({ type: 'changeSpaceTitle', id: space.id, title: next })}
                        // onOrderChange={(next: number) => dispatch({ type: 'changeSpaceOrder', id: space.id, order: next })}
                    />
                );
            })}

            {isOpen && <SpacePreviewCard iconKey={spacePreviewIconKey} title={spacePreviewTitle} description={spacePreviewDescription} />}

            {/* Button to create new space */}
            <NaviPanelAddCard onOpenModal={open} />
            <button className='change-button button-svg-small' onClick={toggleChangable}>
                <SettingsIconComponent size={24} color="white" />
            </button>
            <AddSpaceModal
                isOpen={isOpen}
                onClose={close}
                onspacePreviewChange={handleSpacePreviewChange} />
        </div>
    );
}

export default NaviPanel;