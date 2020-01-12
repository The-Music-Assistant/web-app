grammar AlphaTex;

alphaTex : metadata? '.' track* ;

metadata: (title | subtitle | tempo | artist | album | words | music | copyright | instrument | tuning | capo)*;

track: '\\track' '"'? string+ '"'? trackMetadata;
trackMetadata: (tuning | staff)+;

staff: '\\staff' '{' STAFF_OPTIONS '}' staffMetadata? measure+;
staffMetadata: (tuning | instrument | clef | keySignature | lyrics)*;

measure: measureData+ '|';
measureData: ((timeSignature | clef | tempo)* fixedDuration? (chord | note));
chord: '(' note+ ')' (PERIOD INT beatEffects?)?;
note: noteType (PERIOD INT beatEffects?)?;

fixedDuration: COLON INT beatEffects?;
beatEffects: '{' tuplet '}';
noteType: pitch noteOptions? ;
noteOptions: '{' (TIED | DOTTED)* '}';
pitch: REST | fullNote;
fullNote: noteName INT;

title: '\\title' '"'? string+ '"'?;
subtitle: '\\subtitle' '"'? string+ '"'?;
tempo: '\\tempo' INT;
artist: '\\artist' '"'? string+ '"'?;
album: '\\album' '"'? string+ '"'?;
words: '\\Words' '"'? string+ '"'?;
music: '\\music' '"'? string+ '"'?;
copyright: '\\copyright' '"'? string+ '"'?;
instrument: '\\instrument' '"'? string+ '"'?;
tuning: '\\tuning' '"'? string+ '"'?;
capo: '\\capo' INT;
clef: '\\clef' string+;
keySignature: '\\ks' string+;
lyrics: '\\lyrics' '"'? string+ '"'?;
timeSignature: '\\ts' INT INT;
tuplet: 'tu' INT;

string: WORD | noteName | REST | COLON | INT | PERIOD | UNDERSCORE;
noteName: 'a' | FLAT | 'c' | DOTTED | 'e' | 'f' | 'g' | ACCIDENTAL;

UNDERSCORE: '_';
PERIOD: '.';
COLON: ':';
TIED: '-';
SHARP: '#';
STAFF_OPTIONS: 'score' | 'tabs';
REST: 'r';
FLAT: 'b';
DOTTED: 'd';
ACCIDENTAL: [a-g] ('b' | '#')+;
WORD: [a-zA-Z]+;
INT : [0-9]+;
WS: [ \t\n\r]+ -> skip;