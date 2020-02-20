// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirSelection.js
// Description: Renders the choir selection component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";

// Component imports
import ChoirCard from "./ChoirCard/ChoirCard";

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
        return this.state.choirs.map(choir => {
            return (
                <ChoirCard
                    key={choir.choir_id}
                    headerImgSrc={choir.picture_url}
                    name={choir.choir_name}
                    description={choir.description}
                />
            );
        });
    };

    render() {
        const choirComponents = this.state.choirs ? this.createChoirComponents() : null;

        return <div className={styles.choirSelection}>{choirComponents}</div>;
    }
}

export default ChoirSelection;
