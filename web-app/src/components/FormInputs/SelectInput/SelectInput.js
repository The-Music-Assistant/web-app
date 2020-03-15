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
    constructor(props) {
        super(props);

        // Component state
        this.state = {
            showDropdown: false,
            dropdownValue: this.getMaxLengthString(),
            width: null,
            height: null
        };
    }

    _componentRef = React.createRef();

    componentDidMount() {
        console.log(this.state.dropdownValue);
        this.setState({
            width: parseFloat(getComputedStyle(this._componentRef.current).width),
            height: parseFloat(getComputedStyle(this._componentRef.current).height),
            dropdownValue: this.props.placeholder
        });

        console.log(getComputedStyle(this._componentRef.current).height);
    }

    getMaxLengthString = () => {
        let maxLength = this.props.options.reduce(
            (maxLength, optionStr) => Math.max(maxLength, optionStr.length),
            0
        );
        maxLength = Math.max(maxLength, this.props.placeholder.length);
        return "".padStart(maxLength, "0");
    };

    selectorButtonClickedHandler = () => {
        this.setState(prevState => {
            return {
                showDropdown: !prevState.showDropdown
            };
        });
    };

    optionButtonClickedHandler = event => {
        this.setState({ dropdownValue: event.target.value, showDropdown: false });
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

    getArrowClassList = () => {
        let classList = `${styles.selectInputSelectorArrowImg}`;
        if (this.state.showDropdown) {
            classList += ` ${styles.selectInputSelectorArrowImgShow}`;
        } else {
            classList += ` ${styles.selectInputSelectorArrowImgHide}`;
        }

        return classList;
    };

    render() {
        // Returns the JSX to display
        return (
            <div
                className={styles.selectInput}
                ref={this._componentRef}
                style={{ width: this.state.width, height: this.state.height }}>
                <input
                    className={styles.selectInputInputElement}
                    type='text'
                    name={this.props.name}
                    defaultValue={this.state.dropdownValue}
                />
                <button
                    className={`${styles.selectInputSelector} ${styles[this.props.color]}`}
                    type='button'
                    style={{ width: this.state.width, height: this.state.height }}
                    onClick={this.selectorButtonClickedHandler}>
                    <h2 className={styles.selectInputSelectorTitle}>{this.state.dropdownValue}</h2>
                    <img
                        className={this.getArrowClassList()}
                        src={
                            this.props.color === colorOptions.WHITE ? downArrowBlue : downArrowWhite
                        }
                        alt={"Arrow"}
                    />
                </button>
                <div className={this.getOptionsClassList()} style={{ top: this.state.height + 10 }}>
                    {this.getOptions()}
                </div>
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
