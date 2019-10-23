import React from 'react';
import './SideNavLink.scss';

const SideNavLink = props => {
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div id='side-nav-link-current-tab-line'></div>;
    }

    return (
        <div className="side-nav-link">
            {currentTabLine}
            <img className="side-nav-link-icon" src={props.icon} alt={props.name + " Icon"} />
            <h3 className="side-nav-link-name">{props.name}</h3>
        </div>
    );
}

export default SideNavLink;