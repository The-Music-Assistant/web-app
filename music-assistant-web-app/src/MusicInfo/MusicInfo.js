import React from "react";
import "./MusicInfo.scss";

const MusicInfo = props => {
    const composerNamesString = props.music.composerNames.join(", ");
    const timeInMinutes = `${Math.floor(props.music.time / 60).toString()} m ${(
        props.music.time % 60
    ).toString()} s`;

    return (
        <section id='music-info'>
            <div>
                <h3 id='music-info-title'>{props.music.title}</h3>
                <h4 id='music-info-composers'>{composerNamesString}</h4>
            </div>
            <h5 id='music-info-time'>{timeInMinutes}</h5>
        </section>
    );
};

export default MusicInfo;
