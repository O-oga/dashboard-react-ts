import './Switch.css';
import { CardsIcons } from '../../../Icons';
import type { CardIconTypes } from '../../../../types/Icons.types';
import { CardCreationDataContext } from '../../../ModalWindows/AddCard/AddCardModal';
import { useContext } from 'react';

interface SwitchProps {
    title?: string;
    entity?: string;
    icon?: CardIconTypes;
    size?: 'small' | 'medium' | 'large';
}

function Switch(props?: SwitchProps) {
    const cardCreationData = useContext(CardCreationDataContext);
    if (!cardCreationData) {
        return null;
    }
    const {title, entity, icon} = cardCreationData;
    const IconComponent = CardsIcons[icon as CardIconTypes];
    const SwitchIconComponent = CardsIcons['SwitchIcon'];

    switch (props?.size) {
        case 'small': {
            return (
                <button className="switch switch-small button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SwitchIconComponent size={50} />}
                    </div>
                    <div className="switch-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        case 'medium': {
            return (
                <button className="switch switch-medium button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SwitchIconComponent size={50} />}
                    </div>
                    <div className="switch-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        case 'large': {
            return (
                <button className="switch switch-large button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SwitchIconComponent size={50} />}
                    </div>
                    <div className="switch-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        default: {
            return null;
        }
    }
}

export default Switch;