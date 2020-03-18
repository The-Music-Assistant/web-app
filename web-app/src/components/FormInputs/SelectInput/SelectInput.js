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

        this._maxLengthString = this.getMaxLengthString(); // The maximum-length string of all options

        // Component state
        this.state = {
            value: this._maxLengthString,
            showDropdown: false,
            width: null, // Component width
            height: null, // Component height
            // The screen width ("small" is CSS mobile breakpoint and "large" is CSS >= tablet breakpoint)
            // The only style changes to the component happen between the "mobile" and "tablet" breakpoint
            // If the breakpoints change or breakpoint styles change, this may need to be updated
            screenWidth: window.innerWidth < 768 ? "small" : "large",
            screenSizeChanged: false // Whether or not the screen size changed ("small" <-> "large" only)
        };
    }

    // A reference to the outermost div for this component
    _selectorRef = React.createRef();

    /**
     * Adds a window resize listener
     * Updates the actual value of the select
     * Updates state with the largest needed width and height
     */
    componentDidMount() {
        // Adds a window resize listener
        window.addEventListener("resize", this.windowSizeChangedHandler);

        // Updates state with the current width and height
        // This is the largest width and height needed by any of the options
        this.setState({
            width: parseFloat(getComputedStyle(this._selectorRef.current).width),
            height: parseFloat(getComputedStyle(this._selectorRef.current).height),
            value: this.props.value
        });
    }

    /**
     * Updates the actual value of the select
     * Updates state with the largest needed width and height if needed
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.state.screenSizeChanged) {
            // Updates state with the current width and height, and flips screenSizeChanged to false
            this.setState({
                screenSizeChanged: false,
                width: parseFloat(getComputedStyle(this._selectorRef.current).width),
                height: parseFloat(getComputedStyle(this._selectorRef.current).height),
                value: this.props.value
            });
        } else if (prevProps.value !== this.props.value) {
            // This check ensures that the state value property is not updated unless the new prop value property has changed
            // For a width and height update, the prop value property never changes

            // Updates state with the new value from props
            this.setState({ value: this.props.value });
        }
    }

    /**
     * Removes the window resize listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.windowSizeChangedHandler);
    }

    /**
     * Updates state to trigger a component resize if needed
     */
    windowSizeChangedHandler = () => {
        const oldScreenWidth = this.state.screenWidth;
        const newScreenWidth = parseFloat(window.innerWidth) < 768 ? "small" : "large";

        if (newScreenWidth !== oldScreenWidth) {
            // Updates state to trigger a component resize
            this.setState({
                screenSizeChanged: true,
                screenWidth: newScreenWidth,
                width: "auto",
                height: "auto",
                value: this._maxLengthString
            });
        }
    };

    /**
     * Gets the maximum length string based on all given options, as well as the provided value from props
     * @returns - The maximum length string
     */
    getMaxLengthString = () => {
        // Gets the maximum length string based on all given options
        let maxLengthStr = this.props.options.reduce(
            (maxLengthStr, optionStr) =>
                maxLengthStr.length > optionStr.length ? maxLengthStr : optionStr,
            ""
        );

        // Updates the maximum length string based on the provided value from props
        maxLengthStr =
            maxLengthStr.length > this.props.value.length ? maxLengthStr : this.props.value;

        return maxLengthStr;
    };

    /**
     * Opens or closes the options dropdown
     */
    selectorButtonClickedHandler = () => {
        this.setState(prevState => {
            return {
                showDropdown: !prevState.showDropdown
            };
        });
    };

    /**
     * Sends value update to the parent component
     * Closes the options dropdown
     */
    optionButtonClickedHandler = event => {
        this.props.onChange(event.target.value);

        this.setState({ showDropdown: false });
    };

    /**
     * Creates option elements based on provided options from props
     * @returns - An array of option elements
     */
    getOptions = () => {
        return this.props.options.map((optionName, index) => {
            return (
                <button
                    key={index}
                    className={`${styles.selectInputOption} ${styles[this.props.color]}`}
                    type='button'
                    value={optionName}
                    onClick={this.optionButtonClickedHandler}>
                    {optionName}
                </button>
            );
        });
    };

    /**
     * Gets the CSS classes for the options container element
     * @returns - A string of class names
     */
    getOptionsClassList = () => {
        let classList = `${styles.selectInputOptions} ${styles[this.props.color]}`;
        if (this.state.showDropdown) {
            classList += ` ${styles.selectInputOptionsShow}`;
        } else {
            classList += ` ${styles.selectInputOptionsHide}`;
        }

        return classList;
    };

    /**
     * Gets the CSS classes for the selector arrow
     * @returns - A string of class names
     */
    getArrowClassList = () => {
        let classList = `${styles.selectInputSelectorArrowImg}`;
        if (this.state.showDropdown) {
            classList += ` ${styles.selectInputSelectorArrowImgUp}`;
        } else {
            classList += ` ${styles.selectInputSelectorArrowImgDown}`;
        }

        return classList;
    };

    /**
     * Renders the SelectInput component
     */
    render() {
        // Returns the JSX to display
        return (
            <div
                className={styles.selectInput}
                style={{ width: this.state.width, height: this.state.height }}>
                <input
                    className={styles.selectInputInputElement}
                    type='text'
                    name={this.props.name}
                    defaultValue={this.props.value}
                />
                <button
                    className={`${styles.selectInputSelector} ${styles[this.props.color]}`}
                    ref={this._selectorRef}
                    type='button'
                    style={{ width: this.state.width, height: this.state.height }}
                    onClick={this.selectorButtonClickedHandler}>
                    <h2 className={styles.selectInputSelectorTitle}>{this.state.value}</h2>
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
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
        colorOptions.WHITE,
        colorOptions.BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED
    ]).isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};

export default SelectInput;
