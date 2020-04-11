// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./selectInputColorOptions";

// Image imports
import downArrowBlue from "../../../assets/icons/down-arrow-blue.svg";
import downArrowWhite from "../../../assets/icons/down-arrow-white.svg";

// Style imports
import styles from "./SelectInput.module.scss";

/**
 * Renders the SelectInput component
 * A custom select input.
 * NOTE: This component does not use the select and option HTML elements.
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
class SelectInput extends Component {
    /*
     * NOTE: Both state and props have a value property.
     * The state value property is what is actually displayed.
     * The props value property is either the current selected option or a custom one-time placeholder value.
     * The state value property will either be the prop value property or the _maxLengthString value.
     * The _maxLengthString is temporarily displayed in order to resize the component to the maximum needed width and height.
     * The re-render between _maxLengthString and the props value property should be fast enough that you never see it happen.
     */

    /**
     * Sets up the component state
     */
    constructor(props) {
        super(props);

        /**
         * The maximum-length string of all selection options.
         * Used to size the component properly.
         * @type {string}
         */
        this._maxLengthString = this.getMaxLengthString();

        /**
         * SelectInput component state
         * @property {string} value - The current value of the select (the current selected option).
         * @property {boolean} showDropdown - Indicates if the options dropdown should be shown
         * @property {number} componentWidth - The current width of the component
         * @property {number} componentHeight - The current height of the component
         * @property {boolean} didScreenSizeChange - Indicates if the screen size changed
         */
        this.state = {
            value: this._maxLengthString,
            showDropdown: false,
            componentWidth: null,
            componentHeight: null,
            didScreenSizeChange: false,
        };
    }

    /**
     * A reference to the outermost div element for this component.
     * Uses a React Ref.
     */
    _selectorRef = React.createRef();

    /**
     * Adds a window resize listener.
     * Updates state with the component's width and height.
     */
    componentDidMount() {
        // Adds a window resize listener
        window.addEventListener("resize", this.windowSizeChangedHandler);

        // Updates state with the component's current width and height
        // The current width and height is the largest width and height needed by any of the options
        this.setState({
            componentWidth: parseFloat(getComputedStyle(this._selectorRef.current).width),
            componentHeight: parseFloat(getComputedStyle(this._selectorRef.current).height),
            value: this.props.value,
        });
    }

    /**
     * Updates the actual value of the select.
     * Updates state with the component's width and height if needed.
     */
    componentDidUpdate(prevProps) {
        if (this.state.didScreenSizeChange) {
            // Updates state with the component's width and height
            this.setState({
                didScreenSizeChange: false,
                componentWidth: parseFloat(getComputedStyle(this._selectorRef.current).width),
                componentHeight: parseFloat(getComputedStyle(this._selectorRef.current).height),
                value: this.props.value,
            });
        } else if (prevProps.value !== this.props.value) {
            // This check ensures that the state value property is not updated unless the new prop value property has changed
            // For a width and height update, the prop value property never changes (only the state value property changes)

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
     * @function
     */
    windowSizeChangedHandler = () => {
        // Sets the width and height to auto in order to allow the component to size itself
        // The state value property is set to the max length string so that the component will size itself to fit the longest string
        this.setState({
            didScreenSizeChange: true,
            componentWidth: "auto",
            componentHeight: "auto",
            value: this._maxLengthString,
        });
    };

    /**
     * Gets the maximum length string based on all given selection options, as well as the provided value from props
     * @function
     * @returns {string} The maximum length string
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
     * @function
     */
    selectorButtonClickedHandler = () => {
        this.setState((prevState) => {
            return {
                showDropdown: !prevState.showDropdown,
            };
        });
    };

    /**
     * Calls the onChange handler with the selected option.
     * Updates state to close the options dropdown.
     * @function
     * @param {number} - The index of the option clicked
     */
    optionButtonClickedHandler = (index) => {
        this.props.onChange(index, this.props.options[index]);

        this.setState({ showDropdown: false });
    };

    /**
     * Creates option elements based on provided options from props.
     * This is a custom version of the option HTML element.
     * @function
     * @returns An array of option elements (JSX)
     */
    getOptions = () => {
        return this.props.options.map((optionName, index) => {
            return (
                <button
                    key={index}
                    index={index}
                    className={`${styles.selectInputOption} ${styles[this.props.color]}`}
                    type='button'
                    value={optionName}
                    onClick={() => this.optionButtonClickedHandler(index)}>
                    {optionName}
                </button>
            );
        });
    };

    /**
     * Gets the CSS classes for the options container element
     * @function
     * @returns {string} A string of class names
     */
    getOptionsClassList = () => {
        let classList = `${styles.selectInputOptions} ${styles[this.props.color]}`;

        classList += this.state.showDropdown
            ? ` ${styles.selectInputOptionsShow}`
            : ` ${styles.selectInputOptionsHide}`;

        return classList;
    };

    /**
     * Gets the CSS classes for the selector arrow
     * @function
     * @returns {string} A string of class names
     */
    getArrowClassList = () => {
        let classList = `${styles.selectInputSelectorArrowImg}`;

        classList += this.state.showDropdown
            ? ` ${styles.selectInputSelectorArrowImgUp}`
            : ` ${styles.selectInputSelectorArrowImgDown}`;

        return classList;
    };

    /**
     * Renders the SelectInput component
     */
    render() {
        return (
            <div
                className={styles.selectInput}
                style={{ width: this.state.componentWidth, height: this.state.componentHeight }}>
                {/* A text imput that holds the current select value */}
                <input
                    className={styles.selectInputInputElement}
                    type='text'
                    name={this.props.name}
                    defaultValue={this.props.value}
                />

                {/* A custom version of the select HTML element */}
                <button
                    className={`${styles.selectInputSelector} ${styles[this.props.color]}`}
                    ref={this._selectorRef}
                    type='button'
                    style={{ width: this.state.componentWidth, height: this.state.componentHeight }}
                    onClick={this.selectorButtonClickedHandler}>
                    {/* The select element's title */}
                    <h2 className={styles.selectInputSelectorTitle}>{this.state.value}</h2>

                    {/* The select element's arrow */}
                    <img
                        className={this.getArrowClassList()}
                        src={
                            this.props.color === colorOptions.WHITE ? downArrowBlue : downArrowWhite
                        }
                        alt={"Arrow"}
                    />
                </button>

                {/* A list of custom version's of the option HTML element */}
                <div
                    className={this.getOptionsClassList()}
                    style={{ top: this.state.componentHeight + 10 }}>
                    {this.getOptions()}
                </div>
            </div>
        );
    }
}

// Prop types for the SelectInput component
SelectInput.propTypes = {
    /**
     * The value of the select (the current selected option or a custom one-time placeholder value)
     */
    value: PropTypes.string.isRequired,

    /**
     * The select input's name
     */
    name: PropTypes.string.isRequired,

    /**
     * The component's background color.
     * See [options]{@link module:selectInputColorOptions}.
     */
    color: PropTypes.oneOf([
        colorOptions.WHITE,
        colorOptions.PRIMARY_BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED,
    ]).isRequired,

    /**
     * Options for select component
     */
    options: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * Select change handler (handles option changes)
     */
    onChange: PropTypes.func.isRequired,
};

export default SelectInput;
