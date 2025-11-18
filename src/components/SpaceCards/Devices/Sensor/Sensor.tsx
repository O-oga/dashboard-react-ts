import './Sensor.css';
import { CardsIcons } from '../../../Icons';

function Sensor(props : any) {
    const { title, entity, img } = props;

    const SensorIconComponent = CardsIcons['SensorIcon'];
    
    return (
        <button className="sensor button-svg-dark button-svg">
            <div className="svg-icon">
                <SensorIconComponent size={50} />
            </div>
            <div className="sensor-entity">{entity}</div>
        </button>
    );
}

export default Sensor;