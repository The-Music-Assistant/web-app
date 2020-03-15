// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/SelectInput/SelectInput.js
// Description: Renders the SelectInput component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/14/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./colorOptions";
import downArrowBlue from "../../../assets/icons/down-arrow-blue.svg";
import downArrowWhite from "../../../assets/icons/down-arrow-white.svg";

// Style imports
import styles from "./SelectInput.module.scss";

class SelectInput extends Component {
    // Component state
    state = {
        showDropdown: false,
        dropdownValue: this.props.placeholder
    };

    selectorButtonClickedHandler = () => {
        this.setState(prevState => {
            return {
                showDropdown: !prevState.showDropdown
            };
        });
    };

    optionButtonClickedHandler = event => {
        this.setState({ dropdownValue: event.target.value });
    };

    getOptions = () => {
        return this.props.options.map(optionName => {
            return (
                <button
                    className={`${styles.selectInputOption} ${styles[this.props.color]}`}
                    type='button'
                    value={optionName}
                    onClick={this.optionButtonClickedHandler}>
                    {optionName}
                </button>
            );
        });
    };

    getOptionsClassList = () => {
        let classList = `${styles.selectInputOptions} ${styles[this.props.color]}`;
        if (this.state.showDropdown) {
            classList += ` ${styles.selectInputOptionsShow}`;
        } else {
            classList += ` ${styles.selectInputOptionsHide}`;
        }

        return classList;
    };

    render() {
        // Returns the JSX to display
        return (
            <div className={styles.selectInput}>
                <input
                    className={styles.selectInputInputElement}
                    type='text'
                    name={this.props.name}
                    value={this.state.dropdownValue}
                />
                <button
                    className={`${styles.selectInputSelector} ${styles[this.props.color]}`}
                    type='button'
                    onClick={this.selectorButtonClickedHandler}>
                    <h2 className={styles.selectInputSelectorTitle}>{this.state.dropdownValue}</h2>
                    <img
                        className={styles.selectInputSelectorArrowImg}
                        src={
                            this.props.color === colorOptions.WHITE ? downArrowBlue : downArrowWhite
                        }
                        alt={"Arrow"}
                    />
                </button>
                <div className={this.getOptionsClassList()}>{this.getOptions()}</div>
            </div>
        );
    }
}

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
