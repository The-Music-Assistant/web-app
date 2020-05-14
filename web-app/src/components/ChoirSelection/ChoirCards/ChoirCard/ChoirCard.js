// NPM module imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "../choirCardColorOptions";

// Image imports
import cameraImg from "../../../../assets/icons/camera-icon-white.svg";
import { choirSelectionError } from "../../../../vendors/Firebase/logs";

// Style imports
import cardStyles from "./ChoirCard.module.scss";
import colorStyles from "../ChoirCardColors.module.scss";

/**
 * Renders the ChoirCard component.
 * Shows information about the choir.
 * @component
 * @category ChoirSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ChoirCard = ({
    headerImageSrc,
    name,
    description,
    cardColor,
    onClick,
}) => {
    /**
     * Indicates if there was an error loading the choir's image
     * {[choirImgLoadingError, setChoirImgLoadingError]: [boolean, function]}
     */
    const [isChoirImgLoadingError, setIsChoirImgLoadingError] = useState(false);

    /**
     * Updates state if there was an error loading the choir image
     */
    const choirImgLoadingErrorHandler = () => {
        // Logs the error
        choirSelectionError(
            null,
            "Choir image failed to load.",
            "[ChoirCard/choirImgLoadingErrorHandler]"
        );

        // Updates state
        setIsChoirImgLoadingError(true);
    };

    /**
     * Gets the correct header image
     * @returns An image (JSX)
     */
    const getHeaderImage = () => {
        if (!isChoirImgLoadingError && headerImageSrc) {
            // Returns the choir image
            return (
                <img
                    className={cardStyles.choirCardHeaderImage}
                    src={headerImageSrc}
                    loading="lazy"
                    alt="Choir"
                />
            );
        } else {
            // Returns a placeholder image
            return (
                <div
                    className={`${cardStyles.choirCardHeaderImagePlaceholder} ${
                        colorStyles[cardColor + "Darken"]
                    }`}
                >
                    <img
                        className={
                            cardStyles.choirCardHeaderImagePlaceholderImage
                        }
                        src={cameraImg}
                        alt="Choir"
                        onError={choirImgLoadingErrorHandler}
                    />
                </div>
            );
        }
    };

    /**
     * Renders the ChoirCard component
     */
    return (
        <button
            className={`${cardStyles.choirCard} ${colorStyles[cardColor]}`}
            onClick={onClick}
        >
            <div className={cardStyles.choirCardContent}>
                {/* Header image */}
                {getHeaderImage()}

                {/* Choir name */}
                <h1 className={cardStyles.choirCardName}>{name}</h1>

                {/* Choir description (if one exists) */}
                {description ? (
                    <h2 className={cardStyles.choirCardDescription}>
                        {description}
                    </h2>
                ) : null}
            </div>
        </button>
    );
};

// Prop types for the choir card component
ChoirCard.propTypes = {
    /**
     * The path to the header image
     */
    headerImageSrc: PropTypes.string,

    /**
     * The choir's name
     */
    name: PropTypes.string.isRequired,

    /**
     * The choir's description
     */
    description: PropTypes.string,

    /**
     * The card's background color.
     * See [options]{@link module:choirCardColorOptions}.
     */
    cardColor: PropTypes.oneOf(Object.values(colorOptions)).isRequired,

    /**
     * Click handler for the card
     */
    onClick: PropTypes.func,
};

export default ChoirCard;
