import React from 'react';
import './UserWidget.scss'

const UserWidget = props => {
    return (
        <div id='user-widget'>
            <img id='user-widget-img' src={props.profilePic} alt='Profile Pic' />
            <h2 id='user-widget-name'>{props.name}</h2>
        </div>
    );
}

export default UserWidget;