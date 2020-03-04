// ----------------------------------------------------------------------------
// File Path: src/components/Dropdown/Dropdown.js
// Description: Renders the dropdown component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/4/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./Dropdown.module.scss";

const Dropdown = props => {
    return (
        <div className={styles.dropdown}>
            <label className={styles.dropdownLabel} for={props.id}>TEST</label>
            <select id={props.id} className={styles.dropdownSelect} name={props.name}>
                {props.options.map(option => {
                    return (
                        <option className={styles.dropdownOption} value={option.value}>
                            {option.text}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

// Prop types for the Dropdown component
Dropdown.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.exact({
            value: PropTypes.string,
            name: PropTypes.string
        })
    ).isRequired
};

export default Dropdown;
