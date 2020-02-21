// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirSelection.js
// Description: Renders the choir selection component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import shortid from "shortid";

// Component imports
import ChoirCard from "./ChoirCard/ChoirCard";

// Image imports
import plusIcon from "../../assets/icons/plus-icon.svg";
import questionIcon from "../../assets/icons/question-icon.svg";

// File imports
import { getUsersChoirs } from "../../App/musicAssistantApi";

// Style imports
import styles from "./ChoirSelection.module.scss";

class ChoirSelection extends Component {
    state = {
        isLoading: true,
        choirs: null
    };

    componentDidMount() {
        getUsersChoirs()
            .then(snapshot => this.setState({ choirs: snapshot.data.choirs }))
            .catch(error => console.log(error))
            .finally(this.setState({ isLoading: false }));
    }

    createChoirComponents = () => {
        const colors = ["secondaryBlue", "green", "primaryBlue", "orange", "tertiaryBlue", "red"];
        let colorIndex = -1;
        const components = this.state.choirs.map(choir => {
            colorIndex ++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }
            
            return (
                <ChoirCard
                    key={choir.choir_id}
                    headerImgSrc={choir.picture_url}
                    name={choir.choir_name}
                    description={choir.description}
                    noDescription={false}
                    cardColor={colors[colorIndex]}
                />
            );
        });

        components.push(
            <ChoirCard
                key={shortid.generate()}
                headerImgSrc={plusIcon}
                name='New Choir'
                description={null}
                noDescription={true}
                cardColor="orange"
            />
        );

        components.push(
            <ChoirCard
                key={shortid.generate()}
                headerImgSrc={questionIcon}
                name='View Pending Choir Requests'
                description={null}
                noDescription={true}
                cardColor="tertiaryBlue"
            />
        );

        return components;
    };

    render() {
        const choirComponents = this.state.choirs ? this.createChoirComponents() : null;

        return <div className={styles.choirSelection}>{choirComponents}</div>;
    }
}

export default ChoirSelection;
