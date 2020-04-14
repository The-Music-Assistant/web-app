// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "../choirCardColorOptions";

// Style imports
import optionCardStyles from "./ChoirOptionCard.module.scss";
import cardColorStyles from "../ChoirCardColors.module.scss";

/**
 * Renders the ChoirOptionCard.
 * Used to render a choir card that offers some option (e.g. add a new choir).
 * @component
 * @category ChoirSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ChoirOptionCard = (props) => {
    // Returns the JSX to render
    return (
        <div
            className={`${optionCardStyles.choirOptionCard} ${
                cardColorStyles[props.cardColor]
            }`}
            onClick={props.onClick}
        >
            {/* An icon */}
            <img
                className={optionCardStyles.choirOptionCardIcon}
                src={props.iconSrc}
                alt={props.name}
            />

            {/* The option name */}
            <h1 className={optionCardStyles.choirOptionCardName}>
                {props.name}
            </h1>
        </div>
    );
};

// Prop types for the ChoirOptionCard component
ChoirOptionCard.propTypes = {
    /**
     * The file path to the icon
     */
    iconSrc: PropTypes.string.isRequired,

    /**
     * The option name
     */
    name: PropTypes.string.isRequired,

    /**
     * The card's background color.
     * See [options]{@link module:choirCardColorOptions}.
     */
    cardColor: PropTypes.oneOf([
        colorOptions.PRIMARY_BLUE,
        colorOptions.SECONDARY_BLUE,
        colorOptions.TERTIARY_BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED,
    ]).isRequired,

    /**
     * Click handler for the card
     */
    onClick: PropTypes.func.isRequired,
};

export default ChoirOptionCard;
