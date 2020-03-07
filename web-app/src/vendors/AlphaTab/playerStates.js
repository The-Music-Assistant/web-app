// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/playerStates.js
// Description: Music player state options
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/3/2020
// ----------------------------------------------------------------------------

export const STOPPED = 0;
export const PLAYING = 1;
export const PAGE_CHANGED = 2; // TODO: Is this a good name for this? Seems confusing with the concept of a Page turn, maybe better to say Pending Stop since this is used when we want it to stop and we are waiting for that to happen
