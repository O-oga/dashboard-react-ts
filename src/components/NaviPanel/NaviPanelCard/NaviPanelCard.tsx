import './NaviPanelCard.css';

function NaviPanelCard(props : any) {
    const {icon, title, description, onClick} = props;
    return (
        <div className="navi-panel-card" onClick={onClick}>
            <div className="navi-panel-card-icon">{icon}</div>
            <div className="navi-panel-card-title">{title}</div>
            <div className="navi-panel-card-description">{description}</div>
        </div>
    );
};

export default NaviPanelCard;