// ----------------------------------------------------------------------------
// File Path: src/components/Header/UserWidget/UserWidget.js
// Description: Renders the widget component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from 'react';
import styles from './UserWidget.module.scss'

const UserWidget = props => {
    return (
        <div className={styles.userWidget}>
            <img className={styles.userWidgetImg} src={props.profilePic} alt='Profile Pic' />
            <h2 className={styles.userWidgetName}>{props.name}</h2>
        </div>
    );
}

export default UserWidget;