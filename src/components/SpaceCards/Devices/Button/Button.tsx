import { useContext } from 'react';
import type { CardIconTypes } from '../../../../types/Icons.types';
import { CardsIcons } from '../../../Icons';
import './Button.css';
import { CardCreationDataContext } from '../../../ModalWindows/AddCard/AddCardModal';

interface ButtonProps {
    title?: string;
    entity?: string;
    icon?: CardIconTypes;
    size?: 'small' | 'medium' | 'large';
    id?: number;
}

function Button(props?: ButtonProps) {
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

    const IconComponent = icon ? CardsIcons[icon as CardIconTypes] : CardsIcons['ButtonIcon'];

    const displayTitle = title || (entity ? entity.split('.')[1]?.split('_')[0] : '');

    switch (size) {
        case 'small': {
            return (
                <button 
                    key={id}
                    className="button-small button-svg-dark button-svg">
                    <div className="svg-icon">
                        <IconComponent size={50}/>
                    </div>
                    <div className="button-title">{displayTitle}</div>
                </button>
            )
        }
        case 'medium': {
            return (
                <button 
                    key={id}
                    className="button-medium button-svg-dark button-svg">
                    <div className="svg-icon">
                        <IconComponent size={50}/>
                    </div>
                    <div className="button-title">{displayTitle}</div>
                </button>
            )
        }
        case 'large': {
            return (
                <button 
                    key={id}
                    className="button-large button-svg-dark button-svg">
                    <div className="svg-icon">
                        <IconComponent size={50}/>
                    </div>
                    <div className="button-title">{displayTitle}</div>
                </button>
            )
        }
        default: {
            return null;
        }
    }

}

export default Button;