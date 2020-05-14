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
const ChoirOptionCard = ({ iconSrc, name, cardColor, onClick }) => {
    // Renders the ChoirOptionCard component
    return (
        <button
            className={`${optionCardStyles.choirOptionCard} ${cardColorStyles[cardColor]}`}
            onClick={onClick}
        >
            <div className={optionCardStyles.choirOptionCardContent}>
                {/* Icon */}
                <img
                    className={optionCardStyles.choirOptionCardIcon}
                    src={iconSrc}
                    alt={name}
                />

                {/* Option name */}
                <h1 className={optionCardStyles.choirOptionCardName}>{name}</h1>
            </div>
        </button>
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
    cardColor: PropTypes.oneOf(Object.values(colorOptions)).isRequired,

    /**
     * Click handler for the card
     */
    onClick: PropTypes.func.isRequired,
};

export default ChoirOptionCard;
