
import './NaviPanelCard.css';
import { SpacesIcons, UIIcons } from '../../Icons';
import type { SpaceIconTypes } from '../../../types/Icons.types';
import { useSpaces } from '../../../hooks/useSpaces';

const NaviPanelCard = (props: any) => {
    const { space, isChangable, onSpaceSelect } = props;

    const IconComponent = SpacesIcons[space.icon as SpaceIconTypes];
    const SettingsIconComponent = UIIcons['SettingsIcon'];
    const TrashIconComponent = UIIcons['TrashIcon'];
    const {removeSpace, changeSpace} = useSpaces();



    return (
        <button className="navi-panel-card button-svg" onClick={onSpaceSelect} aria-label={space.description} >
            <IconComponent size={60} color="white" />
            <div
                className="space-card-title"
            >{space.title}</div>
            {isChangable && (
                <>
                    <button className='change-button button-svg-small' onClick={() => changeSpace({ ...space, cards: space.cards })}>
                        <SettingsIconComponent size={24} color="white" />
                    </button>
                    <button className='delete-button button-svg-small' onClick={() => removeSpace(space.id)}>
                        <TrashIconComponent size={24} color="white" />
                    </button>
                </>
            )}
        </button>
    );
};

export default NaviPanelCard;