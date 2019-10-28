import React, {Component} from "react";
import MusicInfo from '../MusicInfo/MusicInfo';
import MusicControls from "../MusicControls/MusicControls";
import "./PracticeMain.scss";

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
            <main>
                <MusicInfo music={this.state.music} />
                <MusicControls isPaused={this.isPaused} />
            </main>
        );
    }
}


export default PracticeMain;
