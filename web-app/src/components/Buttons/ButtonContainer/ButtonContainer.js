// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File imports
import * as buttonTypes from "../buttonTypes";

/**
 * Renders the ButtonContainer component.
 * NOTE: This component is only used to compose other buttons in the Buttons folder.
 * @component
 * @category Buttons
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ButtonContainer = ({className, type, value, onClick, children}) => {
    // Returns the JSX to render
    return (
        // Class name(s) come from props
        <button
            className={className}
            type={type}
            value={value}
            onClick={onClick}
        >
            {/* Children elements that customize the button */}
            {children}
        </button>
    );
};

// Prop types for the ButtonContainer component
ButtonContainer.propTypes = {
    /**
     * A string containing one or more class names.
     * The SCSS styles will come from the parent's stylesheet.
     */
    className: PropTypes.string,

    /**
     * The button's type (HTML type).
     * See [types]{@link module:buttonTypes}.
     */
    type: PropTypes.oneOf(Object.values(buttonTypes)).isRequired,

    /**
     * The button's value (HTML value)
     */
    value: PropTypes.string.isRequired,

    /**
     * Button click handler
     */
    onClick: PropTypes.func,

    /**
     * Any component that this component composes.
     * This component is used to compose HTML buttons.
     * @see https://reactjs.org/docs/react-api.html#reactchildren
     */
    children: PropTypes.array.isRequired,
};

export default ButtonContainer;
