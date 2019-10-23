import React from "react";
import "./MobileNav.scss";
import MobileNavLink from '../MobileNavLink/MobileNavLink';

const MobileNav = props => {
    let mobileNavId = "mobile-nav-"
    if (props.show) {
        mobileNavId += "show";
    } else {
        mobileNavId += "hide";
    }

    return (
        <div id={mobileNavId} className='mobile-nav'>
            {props.tabs.map(tab => {
                return <MobileNavLink key={tab.key} name={tab.name} icon={tab.icon} isCurrentTab={tab.isCurrent} />
            })}
        </div>
    );
};

export default MobileNav;
