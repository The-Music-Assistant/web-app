import React, {Component} from "react";
import PracticeHeader from "../PracticeHeader/PracticeHeader";
import "./PracticeMain.scss";
import sheetMusicPlaceholder from '../assets/images/sheet-music-placeholder.png';

class PracticeMain extends Component {
    state = {
        music: {
            title: "Canon Rock",
            composerNames: ["Jerry C"],
            time: 272,
            control: 'stop'
        }
    };

    isPaused = this.state.control === 'pause' ? true : false;

    render() {
        return (
            <main id="practice-main">
                <PracticeHeader music={this.state.music} isPaused={this.isPaused} />
                <img id="sheet-music-placeholder-img" src={sheetMusicPlaceholder} alt="Placeholder" />
            </main>
        );
    }
}


export default PracticeMain;
