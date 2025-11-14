
import './NaviPanelCard.css';
import { SpacesIcons, UIIcons } from '../../Icons';
import type { SpaceIconTypes } from '../../../types/Icons.types';
import { useSpaces } from '../../../contexts/SpacesContext';
import { useCallback } from 'react';
import type { Space } from '../../../types/space.types';

const NaviPanelCard = (props: any) => {
    const { space, isChangable, onSpaceSelect } = props;

    const IconComponent = SpacesIcons[space.icon as SpaceIconTypes];
    const SettingsIconComponent = UIIcons['SettingsIcon'];
    const TrashIconComponent = UIIcons['TrashIcon'];
    const { removeSpace, changeSpace } = useSpaces();
    const handleSpaceSelect = useCallback((space: Space) => {
        onSpaceSelect(space, space.id);
    }, [onSpaceSelect]);   



    return (
        <div className='navi-panel-card-container'>
            <button className="navi-panel-card button-svg" onClick={() => handleSpaceSelect(space)} aria-label={space.description} >
                <IconComponent size={60} color="white" />
                <div
                    className="space-card-title"
                    >{space.title}</div>
            </button>
            {isChangable && (
                <div className='change-buttons-container'>
                    <button className='change-space-button button-svg-small' onClick={() => changeSpace({ ...space, cards: space.cards })}>
                        <SettingsIconComponent size={24} color="white" />
                    </button>
                    <button className='delete-space-button button-svg-small' onClick={() => removeSpace(space.id)}>
                        <TrashIconComponent size={24} color="white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NaviPanelCard;