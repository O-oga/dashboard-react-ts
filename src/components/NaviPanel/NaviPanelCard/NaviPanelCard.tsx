import { useEffect, useState } from 'react';
import './NaviPanelCard.css';

function NaviPanelCard(props : any) {
    const { icon, description, loadSpacesCards, onTitleChange, onOrderChange} = props;
    const [title, setTitle] = useState(props.title);
    const [order, setOrder] = useState<number>(props.order ?? 0);

    // Sync local state when external title changes
    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    useEffect(() => {
        setOrder(props.order ?? 0);
    }, [props.order]);

    return (
        <div className="navi-panel-card" onClick={loadSpacesCards}>
            <div className="navi-panel-card-icon">{icon}</div>
            <input
                className="navi-panel-card-title"
                value={title}
                onChange={(e) => {
                    const next = e.target.value;
                    setTitle(next);
                    if (onTitleChange) onTitleChange(next);
                }}
            />
            <input
                className="navi-panel-card-order"
                type="number"
                value={order}
                onChange={(e) => {
                    const next = Number(e.target.value);
                    setOrder(next);
                    if (onOrderChange) onOrderChange(next);
                }}
            />
            <div className="navi-panel-card-description">{description}</div>
        </div>
    );
};

export default NaviPanelCard;