import React from "react";
import "./MobileNavLink.scss";

const MobileNavLink = props => {
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div id='mobile-nav-link-current-tab-line'></div>;
    }
    
    return (
        <div className="mobile-nav-link">
            {currentTabLine}
            <img className="mobile-nav-link-icon" src={props.icon} alt={props.name + " Icon"} />
            <h3 className="mobile-nav-link-name">{props.name}</h3>
        </div>
    );
};

export default MobileNavLink;
