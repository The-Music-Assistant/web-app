import React from "react";
import "./MobileNav.scss";
import MobileNavLink from './MobileNavLink/MobileNavLink';

const MobileNav = props => {
    let showHideId = "mobile-nav-"
    if (props.show) {
        showHideId += "show";
    } else {
        showHideId += "hide";
    }

    return (
        <div id={showHideId} className='mobile-nav'>
            {props.tabs.map(tab => {
                return <MobileNavLink key={tab.key} name={tab.name} icon={tab.mobileIcon} isCurrentTab={tab.isCurrent} />
            })}
        </div>
    );
};

export default MobileNav;
