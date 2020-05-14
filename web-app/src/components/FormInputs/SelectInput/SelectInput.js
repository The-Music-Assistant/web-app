// NPM module imports
import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./selectInputColorOptions";

// Image imports
import downArrowBlue from "../../../assets/icons/down-arrow-blue.svg";
import downArrowWhite from "../../../assets/icons/down-arrow-white.svg";

// Style imports
import styles from "./SelectInput.module.scss";
import colorStyles from "./SelectInputColors.module.scss";

/**
 * Renders the SelectInput component
 * A custom select input.
 * NOTE: This component does not use the select and option HTML elements.
 * @component
 * @category FormInputs
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SelectInput = ({ value, name, color, options, onChange }) => {
    /*
     * NOTE: Both state and props have a value property.
     * The state value property is what is actually displayed.
     * The props value property is either the current selected option or a custom one-time placeholder value.
     * The state value property will either be the prop value property or the maxLengthString value.
     * The maxLengthString is temporarily displayed in order to resize the component to the maximum needed width and height.
     * The re-render between maxLengthString and the props value property should be fast enough that you never see it happen.
     */

    /**
     * Gets the maximum length string based on all given selection options, as well as the provided value from props
     * @returns {string} The maximum length string
     */
    const getMaxLengthString = () => {
        // Gets the maximum length string based on all given options
        let maxLengthStr = options.reduce(
            (maxLengthStr, optionStr) =>
                maxLengthStr.length > optionStr.length
                    ? maxLengthStr
                    : optionStr,
            ""
        );

        // Updates the maximum length string based on the provided value from props
        maxLengthStr =
            maxLengthStr.length > value.length ? maxLengthStr : value;

        return maxLengthStr;
    };

    /**
     * The maximum-length string of all selection options.
     * Used to size the component properly.
     * @type {string}
     */
    const maxLengthString = useRef(getMaxLengthString());

    /**
     * Updates state to trigger a component resize if needed
     */
    const windowSizeChangedHandler = useCallback(() => {
        // Sets the width and height to auto in order to allow the component to size itself
        // setComponentWidth("auto");
        // setComponentHeight("auto");
        setComponentDimensions({ width: "auto", height: "auto" });

        // The selected option is set to the max length string so that the component will size itself to fit the longest string
        setSelectedOption(maxLengthString.current);

        setScreenSizeDidChange(true);
    }, []);

    /**
     * The current value of the select (the current selected option)
     * {[selectedOption, setSelectedOption]: [string, function]}
     */
    const [selectedOption, setSelectedOption] = useState(
        maxLengthString.current
    );

    /**
     * Indicates if the options dropdown should be shown
     * {[dropdownShouldShow, setDropdownShouldShow]: [boolean, function]}
     */
    const [dropdownShouldShow, setDropdownShouldShow] = useState(false);

    /**
     * The current width of the component
     * {[componentWidth, setComponentWidth]: [string, function]}
     */
    // const [componentWidth, setComponentWidth] = useState(null);

    /**
     * The current height of the component
     * {[componentHeight, setComponentHeight]: [string, function]}
     */
    // const [componentHeight, setComponentHeight] = useState(null);

    const [componentDimensions, setComponentDimensions] = useState({
        width: "auto",
        height: "auto",
    });

    /**
     * Indicates if the screen size changed
     * {[screenSizeDidChange, setScreenSizeDidChange]: [boolean, function]}
     */
    const [screenSizeDidChange, setScreenSizeDidChange] = useState(false);

    /**
     * A reference to the outermost div element for this component.
     * Uses a React Ref.
     */
    const selectorRef = useRef();

    /**
     * Adds a window resize listener.
     * Updates state with the component's width and height.
     * @returns {function} A cleanup function that removes the window resize listener
     */
    useEffect(() => {
        // Adds a window resize listener
        window.addEventListener("resize", windowSizeChangedHandler);

        return () => {
            window.removeEventListener("resize", windowSizeChangedHandler);
        };
    }, [windowSizeChangedHandler]);

    /**
     * Updates state with the component's width and height
     */
    useEffect(() => {
        // Updates state with the component's current width and height
        // The current width and height is the largest width and height needed by any of the options
        // setComponentWidth(selectorRef.current.getBoundingClientRect().width);
        // setComponentHeight(selectorRef.current.getBoundingClientRect().height);
        setComponentDimensions({
            width: selectorRef.current.getBoundingClientRect().width,
            height: selectorRef.current.getBoundingClientRect().height,
        });

        setSelectedOption(value);

        setScreenSizeDidChange(false);
    }, [screenSizeDidChange, value]);

    /**
     * Updates the actual value of the select
     */
    useEffect(() => {
        setSelectedOption(value);
    }, [value]);

    /**
     * Opens or closes the options dropdown
     */
    const selectorButtonClickedHandler = () => {
        setDropdownShouldShow((prevState) => !prevState);
    };

    /**
     * Calls the onChange handler with the selected option.
     * Updates state to close the options dropdown.
     * @param {number} - The index of the option clicked
     */
    const optionButtonClickedHandler = (index) => {
        // Only call the onClick function if the selected value is different than the current value
        if (value !== options[index]) {
            onChange(index, options[index]);
        }

        setDropdownShouldShow(false);
    };

    /**
     * Creates option elements based on provided options from props.
     * This is a custom version of the option HTML element.
     * @returns An array of option elements (JSX)
     */
    const getOptions = () => {
        return options.map((optionName, index) => {
            return (
                <button
                    key={index}
                    index={index}
                    className={`${styles.selectInputOption} ${colorStyles[color]}`}
                    type="button"
                    value={optionName}
                    onClick={() => optionButtonClickedHandler(index)}
                >
                    {optionName}
                </button>
            );
        });
    };

    /**
     * Gets the CSS classes for the options container element
     * @returns {string} A string of class names
     */
    const getOptionsClassList = () => {
        let classList = `${styles.selectInputOptions} ${colorStyles[color]}`;

        classList += dropdownShouldShow
            ? ` ${styles.selectInputOptionsShow}`
            : ` ${styles.selectInputOptionsHide}`;

        return classList;
    };

    /**
     * Gets the CSS classes for the selector arrow
     * @returns {string} A string of class names
     */
    const getArrowClassList = () => {
        let classList = `${styles.selectInputSelectorArrowImg}`;

        classList += dropdownShouldShow
            ? ` ${styles.selectInputSelectorArrowImgUp}`
            : ` ${styles.selectInputSelectorArrowImgDown}`;

        return classList;
    };

    // Renders the SelectInput component
    return (
        <section
            className={styles.selectInput}
            style={{
                width: componentDimensions.width,
                height: componentDimensions.height,
            }}
        >
            {/* A text imput that holds the current select value */}
            <input
                className={styles.selectInputInputElement}
                type="text"
                name={name}
                defaultValue={value}
            />

            {/* A custom version of the select HTML element */}
            <button
                className={`${styles.selectInputSelector} ${colorStyles[color]}`}
                ref={selectorRef}
                type="button"
                style={{
                    width: componentDimensions.width,
                    height: componentDimensions.height,
                }}
                onClick={selectorButtonClickedHandler}
            >
                {/* The select element's title */}
                <h2 className={styles.selectInputSelectorTitle}>
                    {selectedOption}
                </h2>

                {/* The select element's arrow */}
                <img
                    className={getArrowClassList()}
                    src={
                        color === colorOptions.WHITE
                            ? downArrowBlue
                            : downArrowWhite
                    }
                    alt={"Arrow"}
                />
            </button>

            {/* A list of custom version's of the option HTML element */}
            <div
                className={getOptionsClassList()}
                style={{ top: componentDimensions.height + 10 }}
            >
                {getOptions()}
            </div>
        </section>
    );
};

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
    color: PropTypes.oneOf(Object.values(colorOptions)).isRequired,

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
