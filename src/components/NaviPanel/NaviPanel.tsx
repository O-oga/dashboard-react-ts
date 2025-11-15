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

    const { spaces } = useSpaces();
    const [spacePreviewIconKey, setSpacePreviewIconKey] = useState<SpaceIconTypes>('HomeIcon');
    const [spacePreviewTitle, setSpacePreviewTitle] = useState<string>('');
    const [spacePreviewDescription, setSpacePreviewDescription] = useState<string>('');

    const { isOpen: isAddCardModalOpen, open: openAddCardModal, close: closeAddCardModal } = useDisclosure(false, {
        onOpen: () => { console.log('openAddCardModal') },
        onClose: () => { console.log('closeAddCardModal') }
    });

    const { isOpen: isChangable, toggle: toggleChangable } = useDisclosure(false, {
        onOpen: () => { console.log('visible') },
        onClose: () => { console.log('invisible') }
    });

    const SwapIconComponent = UIIcons['SwapIcon'];
    const SettingsIconComponent = UIIcons['SettingsIcon'];
    const ExitIconComponent = UIIcons['ExitIcon'];
    // Memoize callback to prevent unnecessary re-renders
    const handleSpacePreviewChange = useCallback((space: { name: string; description: string; icon: SpaceIconTypes }) => {
        setSpacePreviewIconKey(space.icon as SpaceIconTypes);
        setSpacePreviewTitle(space.name);
        setSpacePreviewDescription(space.description);
    }, []);

    // Memoize order values to prevent unnecessary re-sorting when only cards change
    const spacesOrderKey = useMemo(() => {
        const key = spaces.map(s => `${s.id}:${s.order ?? 0}`).join(',');
        console.log(key);
        return key;
    },
        [spaces]
    );

    const sortedSpaces = useMemo(() => {
        return [...spaces].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [spacesOrderKey]);

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
            className={`navi-panel ${isAddCardModalOpen ? 'navi-panel-disabled' : ''}`}
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

            {isAddCardModalOpen && <SpacePreviewCard iconKey={spacePreviewIconKey} title={spacePreviewTitle} description={spacePreviewDescription} />}

            {/* Button to create new space */}
            <NaviPanelAddCard onOpenModal={openAddCardModal} />
            <div className='settings-buttons-container'>
                <button className='change-button button-svg button-svg-small button-svg-dark' onClick={toggleChangable}>
                    <SwapIconComponent size={24} color="white" />
                </button>
                <button className='settings-button button-svg button-svg-small button-svg-dark'>
                    <SettingsIconComponent size={24} color="white" />
                </button>
                <button 
                // onClick={logout}
                className='exit-button button-svg button-svg-small button-svg-dark'>
                    <ExitIconComponent size={24} color="white" />
                </button>
            </div>
            <AddSpaceModal
                isOpen={isAddCardModalOpen}
                onClose={closeAddCardModal}
                onspacePreviewChange={handleSpacePreviewChange} />
        </div>
    );
}

export default NaviPanel;