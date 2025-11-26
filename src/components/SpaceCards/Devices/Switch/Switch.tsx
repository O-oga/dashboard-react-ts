import './Switch.css';
import { CardsIcons } from '@/components/Icons';
import type { CardIconTypes } from '@/types/Icons.types';
import { CardCreationDataContext } from '@/components/ModalWindows/AddCard/AddCardModal';
import { useContext } from 'react';

interface SwitchProps {
    title?: string;
    entity?: string;
    icon?: CardIconTypes;
    size?: 'small' | 'medium' | 'large';
    id?: number;
}

function Switch(props?: SwitchProps) {
    const cardCreationData = useContext(CardCreationDataContext);
    
    // Use props if provided, otherwise fall back to context (for creation mode)
    const title = props?.title ?? cardCreationData?.title ?? '';
    const entity = props?.entity ?? cardCreationData?.entity ?? '';
    const icon = props?.icon ?? cardCreationData?.icon;
    const size = props?.size ?? cardCreationData?.size ?? 'small';
    const id = props?.id ?? 0;

    // If neither props nor context are available, return null
    if (!props && !cardCreationData) {
        return null;
    }

    const IconComponent = icon ? CardsIcons[icon as CardIconTypes] : CardsIcons['SwitchIcon'];

    const displayTitle = title || (entity ? entity.split('.')[1]?.split('_')[0] : '');

    switch (size) {
        case 'small': {
            return (
                <button 
                    key={id}
                    className="switch switch-small button-svg-dark button-svg">
                    <div className="svg-icon">
                        <IconComponent size={50}/>
                    </div>
                    <div className="switch-title">{displayTitle}</div>
                </button>
            )
        }
        case 'medium': {
            return (
                <button 
                    key={id} 
                    className="switch switch-medium button-svg-dark button-svg">
                    <div className="svg-icon">
                    <IconComponent size={50}/>
                    </div>
                    <div className="switch-title">{displayTitle}</div>
                </button>
            )
        }
        case 'large': {
            return (
                <button 
                    key={id} 
                    className="switch switch-large button-svg-dark button-svg">
                    <div className="svg-icon">
                    <IconComponent size={50}/>
                    </div>
                    <div className="switch-title">{displayTitle}</div>
                </button>
            )
        }
        default: {
            return null;
        }
    }
}

export default Switch;