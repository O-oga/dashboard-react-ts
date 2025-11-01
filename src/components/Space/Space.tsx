import Sensor from '../SpaceCards/Devices/Sensor/Sensor';
import Switch from '../SpaceCards/Devices/Switch/Switch';
import './Space.css';

function Space(props: any) {
    const { createdCards } = props;




    return (
        <div className="space">
            {/* if (createdCards!=[]) {
                createdCards.map((card: any) => {
                    switch (card.type) {

                        case 'switch': {
                            return <Switch cardData={[card]}></Switch>
                        }
                        case 'sensor': {
                            return <Sensor cardData={[card]}></Sensor>
                        }
                    }
                })
            } */}

            <button className="card-svg button-svg" type="button" aria-label='Create new card'>
                <svg className="card-svg" id="add-svg" width="80px" height="80px" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#EAEAEA17" strokeWidth="1.5"
                        strokeLinecap="round" />
                    <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                        stroke="#EAEAEA17" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className="name-on-card">Pin new card</div>
            </button>
        </div >
    );
}

export default Space;