import './Sensor.css';
import { CardsIcons } from '../../../Icons';
import type { CardIconTypes } from '../../../../types/Icons.types';

function Sensor(props : any) {
    const { title, entity, icon } = props;
    const IconComponent = CardsIcons[icon as CardIconTypes];
    const SensorIconComponent = CardsIcons['SensorIcon'];
    
    return (
        <button className="sensor button-svg-dark button-svg">
            <div className="svg-icon">
                {icon ? <IconComponent size={50} /> : <SensorIconComponent size={50} />}
            </div>
            <div className="sensor-title">{title}</div>
            <div className="sensor-entity">{entity}</div>
        </button>
    );
}

export default Sensor;