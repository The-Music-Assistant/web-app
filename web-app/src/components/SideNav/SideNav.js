import React from 'react';
import './SideNav.scss';
import SideNavLink from './SideNavLink/SideNavLink';

const SideNav = props => {
    return (
        <section id='side-nav'>
        {props.tabs.map(tab => {
            return <SideNavLink key={tab.key} name={tab.name} icon={tab.desktopIcon} isCurrentTab={tab.isCurrent} />
        })}
    </section>
    );
}

export default SideNav;