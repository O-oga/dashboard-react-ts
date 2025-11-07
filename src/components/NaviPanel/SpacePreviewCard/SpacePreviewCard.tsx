import { useTranslation } from 'react-i18next';
import type { SpaceIconTypes } from '../../../types/Icons.types';
import { SpacesIcons } from '../../Icons';
import './SpacePreviewCard.css';

function SpacePreviewCard(props : any) {
    const { t } = useTranslation();
    const { iconKey, title, description} = props;

    const SpaceIcon = iconKey&&SpacesIcons[iconKey as SpaceIconTypes];
    
    if (!SpaceIcon) {
        return null;
    }
    
    return (
        <button 
        className="navi-panel-button button-svg" 
        type="button"
        aria-label={description || t('naviPanel.createNewSpace')}>
            <div className="space-card-icon"><SpaceIcon size={55} color="white" /></div>
            <div className='space-card-title'>{title || t('naviPanel.anyName')}</div>
        </button>
    );
}

export default SpacePreviewCard;