import './Sensor.css';
import { CardsIcons } from '../../../Icons';
import type { CardIconTypes } from '../../../../types/Icons.types';
import { CardCreationDataContext } from '../../../ModalWindows/AddCard/AddCardModal';
import { useContext } from 'react';

function Sensor() {
    const cardCreationData = useContext(CardCreationDataContext);
    if (!cardCreationData) {
        return null;
    }
    const {title, entity, icon, size} = cardCreationData;
    const IconComponent = CardsIcons[icon as CardIconTypes];
    const SensorIconComponent = CardsIcons['SensorIcon'];
    
    switch (size) {
        case 'small': {
            return (
                <button className="sensor-small button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SensorIconComponent size={50} />}
                    </div>
                    <div className="sensor-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        case 'medium': {
            return (
                <button className="sensor-medium button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SensorIconComponent size={50} />}
                    </div>
                    <div className="sensor-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        case 'large': {
            return (
                <button className="sensor-large button-svg-dark button-svg">
                    <div className="svg-icon">
                        {icon ? <IconComponent size={50} /> : <SensorIconComponent size={50} />}
                    </div>
                    <div className="sensor-title">{title ? title : entity ? entity.split('.')[1].split('_')[0] : ''}</div>
                </button>
            )
        }
        default: {
            return null;
        }
    }
}

export default Sensor;