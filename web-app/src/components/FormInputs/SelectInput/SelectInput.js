// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/SelectInput/SelectInput.js
// Description: Renders the SelectInput component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/14/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./colorOptions";
import downArrowBlue from "../../../assets/icons/down-arrow-blue.svg";
import downArrowWhite from "../../../assets/icons/down-arrow-white.svg";

// Style imports
import styles from "./SelectInput.module.scss";

const SelectInput = props => {
    const getOptions = () => {
        return props.options.map(optionName => {
            return <h2 className={styles.selectInputOption}>{optionName}</h2>;
        });
    };

    // Returns the JSX to display
    return (
        <div className={styles.selectInput}>
            <input className={styles.selectInputInputElement} type='text' name={props.name} />
            <div className={`${styles.selectInputSelector} ${styles[props.color]}`}>
                <h2 className={styles.selectInputSelectorTitle}>{props.placeholder}</h2>
                <img
                    className={styles.selectInputSelectorArrowImg}
                    src={props.color === colorOptions.WHITE ? downArrowBlue : downArrowWhite}
                    alt={"Arrow"}
                />
            </div>
            <div className={`${styles.selectInputOptions} ${styles[props.color]}`}>
                {getOptions()}
            </div>
        </div>
    );
};

// Prop types for the SelectInput component
SelectInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
        colorOptions.WHITE,
        colorOptions.BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED
    ]).isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SelectInput;
