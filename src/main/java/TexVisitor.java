import alphatex.*;

import java.util.LinkedList;
import java.util.List;

public class TexVisitor extends AlphaTexBaseVisitor<AlphaTexStructure> {
    AlphaTexStructure alphaTexStructure;

    public TexVisitor(AlphaTexParser.AlphaTexContext ctx) {
        alphaTexStructure = ctx.accept(this);
    }

    @Override public AlphaTexStructure visitAlphaTex(AlphaTexParser.AlphaTexContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        if (ctx.metadata() != null) {
            alphaTexStructure.copyAttributes(ctx.metadata().accept(this));
        }

        for (AlphaTexParser.TrackContext trackContext : ctx.track()) {
            AlphaTexStructure ret = trackContext.accept(this);
            alphaTexStructure.copyTracks(ret);
        }

        return alphaTexStructure;
    }

    @Override public AlphaTexStructure visitMetadata(AlphaTexParser.MetadataContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();

        for (AlphaTexParser.TitleContext titleContext : ctx.title()) {
            alphaTexStructure.copyAttributes(titleContext.accept(this));
        }

        for (AlphaTexParser.SubtitleContext subtitleContext : ctx.subtitle()) {
            alphaTexStructure.copyAttributes(subtitleContext.accept(this));
        }

        for (AlphaTexParser.TempoContext tempoContext : ctx.tempo()) {
            alphaTexStructure.copyAttributes(tempoContext.accept(this));
        }

        for (AlphaTexParser.ArtistContext artistContext : ctx.artist()) {
            alphaTexStructure.copyAttributes(artistContext.accept(this));
        }

        for (AlphaTexParser.AlbumContext albumContext : ctx.album()) {
            alphaTexStructure.copyAttributes(albumContext.accept(this));
        }

        for (AlphaTexParser.WordsContext word : ctx.words()) {
            alphaTexStructure.copyAttributes(word.accept(this));
        }

        for (AlphaTexParser.MusicContext music : ctx.music()) {
            alphaTexStructure.copyAttributes(music.accept(this));
        }

        for (AlphaTexParser.CopyrightContext copyrightContext : ctx.copyright()) {
            alphaTexStructure.copyAttributes(copyrightContext.accept(this));
        }

        for (AlphaTexParser.InstrumentContext instrumentContext : ctx.instrument()) {
            alphaTexStructure.copyAttributes(instrumentContext.accept(this));
        }

        for (AlphaTexParser.TuningContext tuningContext : ctx.tuning()) {
            alphaTexStructure.copyAttributes(tuningContext.accept(this));
        }

        for (AlphaTexParser.CapoContext capoContext : ctx.capo()) {
            alphaTexStructure.copyAttributes(capoContext.accept(this));
        }

        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitTrack(AlphaTexParser.TrackContext ctx) {
        AlphaTexStructure ret = new AlphaTexStructure();
        String trackName = getString(ctx.string());
        Track track = new Track();

        track.addTrackName(trackName);
        track.getTrackData().copy(ctx.trackMetadata().accept(this).getTracks().get(0).getTrackData());

        ret.addTrack(track);
        return ret;
    }

    @Override
    public AlphaTexStructure visitTrackMetadata(AlphaTexParser.TrackMetadataContext ctx) {
        AlphaTexStructure ret = new AlphaTexStructure();

        Track track = new Track();
        for (AlphaTexParser.TuningContext tuningContext : ctx.tuning()) {
            track.getTrackData().addTuning(tuningContext.accept(this).getStr("tuning"));
        }

        for (AlphaTexParser.StaffContext staff : ctx.staff()) {
            track.getTrackData().copy(staff.accept(this).getTracks().get(0).getTrackData());
        }

        ret.addTrack(track);

        return ret;
    }

    @Override
    public AlphaTexStructure visitStaff(AlphaTexParser.StaffContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        Track track = new Track();
        Staff staff = new Staff();

        String staffOption = ctx.getText();
        staffOption = staffOption.split("\\{")[1].split("}")[0];
        staff.setStaffOption(staffOption);

        if (ctx.staffMetadata() != null) {
            staff.copyAttributes(ctx.staffMetadata().accept(this));
        }

        int fixedDuration = -1;
        for (AlphaTexParser.MeasureContext measureContext : ctx.measure()) {
            AlphaTexStructure ret = measureContext.accept(this);

            if (ret.getInt("fixedDuration") != -1) {
                fixedDuration = ret.getInt("fixedDuration");
            }
            ret.removeInt("fixedDuration");

            if (fixedDuration != -1) {
                for (Measure measure : ret.getTracks().get(0).getTrackData().getStaffs().get(0).getMeasures()) {
                    for (Chord chord : measure.getChords()) {
                        for (Note note : chord.getNotes()) {
                            if (note.getDuration() == -1) {
                                note.setDuration(fixedDuration);
                            }
                        }
                    }
                }
            }

            staff.copyMeasures(ret.getTracks().get(0).getTrackData().getStaffs().get(0));
        }

        track.getTrackData().addStaff(staff);
        alphaTexStructure.addTrack(track);
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitStaffMetadata(AlphaTexParser.StaffMetadataContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        // tuning | instrument | clef | keySignature | lyrics
        for (AlphaTexParser.TuningContext tuningContext : ctx.tuning()) {
            alphaTexStructure.copyAttributes(tuningContext.accept(this));
        }

        for (AlphaTexParser.InstrumentContext instrumentContext : ctx.instrument()) {
            alphaTexStructure.copyAttributes(instrumentContext.accept(this));
        }

        for (AlphaTexParser.ClefContext clefContext : ctx.clef()) {
            alphaTexStructure.copyAttributes(clefContext.accept(this));
        }

        for (AlphaTexParser.KeySignatureContext keySignatureContext : ctx.keySignature()) {
            alphaTexStructure.copyAttributes(keySignatureContext.accept(this));
        }

        for (AlphaTexParser.LyricsContext lyric : ctx.lyrics()) {
            alphaTexStructure.copyAttributes(lyric.accept(this));
        }

        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitMeasure(AlphaTexParser.MeasureContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        Track track = new Track();
        Staff staff = new Staff();

        Measure overallMeasure = new Measure();

        int fixedDuration = -1;
        for (AlphaTexParser.MeasureDataContext measureDatum : ctx.measureData()) {
            AlphaTexStructure ret = measureDatum.accept(this);
            Measure retMeasure = ret.getTracks().get(0).getTrackData().getStaffs().get(0).getMeasures().get(0);

            if (retMeasure.getInt("fixedDuration") != null) {
                fixedDuration = retMeasure.getInt("fixedDuration");
                retMeasure.removeInt("fixedDuration");
                if (retMeasure.getInt("tuplet") != null) {
                    alphaTexStructure.setInt("tuplet", retMeasure.getInt("tuplet"));
                    alphaTexStructure.setInt("tupletCounter", 0);
                    retMeasure.removeInt("tuplet");
                }
            }

            for (Chord nextChord : retMeasure.getChords()) {
                for (Note note : nextChord.getNotes()) {
                    if (note.getDuration() < 0 && fixedDuration != -1) {
                        note.setDuration(fixedDuration);
                    }
                    if (alphaTexStructure.getInt("tupletCounter") != null) {
                        if (alphaTexStructure.getInt("tupletCounter") < alphaTexStructure.getInt("tuplet")) {
                            note.addBeatEffect("tuplet " + alphaTexStructure.getInt("tuplet"));
                            alphaTexStructure.setInt("tupletCounter",
                                    alphaTexStructure.getInt("tupletCounter") + 1);
                        } else {
                            alphaTexStructure.removeInt("tupletCounter");
                            alphaTexStructure.removeInt("tuplet");
                        }
                    }
                }
            }

            overallMeasure.copy(retMeasure);
        }

        alphaTexStructure.removeInt("tupletCounter");
        alphaTexStructure.removeInt("tuplet");

        alphaTexStructure.setInt("fixedDuration", fixedDuration);

        staff.addMeasure(overallMeasure);
        track.getTrackData().addStaff(staff);
        alphaTexStructure.addTrack(track);
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitMeasureData(AlphaTexParser.MeasureDataContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        Track track = new Track();
        Staff staff = new Staff();
        Measure measure = new Measure();

        for (AlphaTexParser.TimeSignatureContext timeSignatureContext : ctx.timeSignature()) {
            measure.copyAttributes(timeSignatureContext.accept(this));
        }
        for (AlphaTexParser.ClefContext clefContext : ctx.clef()) {
            measure.copyAttributes(clefContext.accept(this));
        }
        for (AlphaTexParser.TempoContext tempoContext : ctx.tempo()) {
            measure.copyAttributes(tempoContext.accept(this));
        }

        boolean hasBeatEffects = false;

        AlphaTexParser.FixedDurationContext fixedDurationContext = ctx.fixedDuration();
        if (fixedDurationContext != null) {
            measure.setInt("fixedDuration", Integer.parseInt(fixedDurationContext.INT().getText()));
            if (fixedDurationContext.beatEffects() != null) {
                measure.setInt("tuplet", Integer.parseInt(fixedDurationContext.beatEffects().tuplet().INT().getText()));
                hasBeatEffects = true;
            }
        }

        Chord chord = new Chord();

        if (ctx.chord() != null) {
            Staff staffRet = ctx.chord().accept(this).getTracks().get(0).getTrackData().getStaffs().get(0);
            LinkedList<Note> notesRet = staffRet.getMeasures().get(0).getChords().get(0).getNotes();
            for (Note note : notesRet) {
                chord.addNote(note);
            }
        } else if (ctx.note() != null) {
            Staff staffRet = ctx.note().accept(this).getTracks().get(0).getTrackData().getStaffs().get(0);
            chord.addNote(staffRet.getMeasures().get(0).getChords().get(0).getNotes().get(0));
        }

        for (Note note : chord.getNotes()) {
            if (note.getDuration() == -1 && measure.getInt("fixedDuration") != null) {
                note.setDuration(measure.getInt("fixedDuration"));
            }
            if (hasBeatEffects) {
                note.addBeatEffect("tuplet " + measure.getInt("tuplet"));
            }
        }

        measure.addChord(chord);
        staff.addMeasure(measure);
        track.getTrackData().addStaff(staff);
        alphaTexStructure.addTrack(track);

        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitChord(AlphaTexParser.ChordContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        Track track = new Track();
        Staff staff = new Staff();
        Measure measure = new Measure();
        Chord chord = new Chord();

        for (AlphaTexParser.NoteContext noteContext : ctx.note()) {
            Staff staffRet = noteContext.accept(this).getTracks().get(0).getTrackData().getStaffs().get(0);
            chord.addNote(staffRet.getMeasures().get(0).getChords().get(0).getNotes().get(0));
        }

        if (ctx.beatEffects() != null) {
            for (Note note : chord.getNotes()) {
                note.addBeatEffect("tuplet " + Integer.parseInt(ctx.beatEffects().tuplet().INT().getText()));
            }
        }

        track.getTrackData().addStaff(staff);
        staff.addMeasure(measure);
        measure.addChord(chord);
        alphaTexStructure.addTrack(track);
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitNote(AlphaTexParser.NoteContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        Track track = new Track();
        Staff staff = new Staff();
        Measure measure = new Measure();
        Chord chord = new Chord();
        Note note = new Note();

        AlphaTexStructure ret = ctx.noteType().accept(this);
        note.copyEffects(ret.getAttributesBool());
        note.setNote(ret.getStr("pitch"));
        note.setOctave(ret.getInt("octave"));

        if (ctx.INT() != null) {
            note.setDuration(Integer.parseInt(ctx.INT().getText()));

            if (ctx.beatEffects() != null) {
                note.addBeatEffect("tuplet " + Integer.parseInt(ctx.beatEffects().tuplet().INT().getText()));
            }
        }

        chord.addNote(note);
        measure.addChord(chord);
        staff.addMeasure(measure);
        track.getTrackData().addStaff(staff);
        alphaTexStructure.addTrack(track);
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitNoteType(AlphaTexParser.NoteTypeContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        alphaTexStructure.copyAttributes(ctx.pitch().accept(this));
        if (ctx.noteOptions() != null) {
            alphaTexStructure.copyAttributes(ctx.noteOptions().accept(this));
        }
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitNoteOptions(AlphaTexParser.NoteOptionsContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        if (ctx.TIED().size() > 0) {
            alphaTexStructure.addBool("tied");
        }
        if (ctx.DOTTED().size() > 0) {
            alphaTexStructure.addBool("dotted");
        }
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitPitch(AlphaTexParser.PitchContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        if (ctx.REST() != null) {
            alphaTexStructure.setStr("pitch", "r");
            alphaTexStructure.setInt("octave", -1);
        } else if (ctx.fullNote() != null) {
            alphaTexStructure.copyAttributes(ctx.fullNote().accept(this));
        }

        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitFullNote(AlphaTexParser.FullNoteContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        StringBuilder noteName = new StringBuilder(ctx.getText());
        String octave = ctx.INT().getText();
        for (int i = noteName.length(); i > -1; i--) {
            if (noteName.substring(i).equals(octave)) {
                noteName.delete(i, noteName.length());
                break;
            }
        }
        alphaTexStructure.setStr("pitch", noteName.toString());
        alphaTexStructure.setInt("octave", Integer.parseInt(octave));

        return alphaTexStructure;
    }

    public AlphaTexStructure createAndSetStr(String attribute, String value) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        alphaTexStructure.setStr(attribute, value);
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitTitle(AlphaTexParser.TitleContext ctx) {
        String title = getString(ctx.string());
        return createAndSetStr("title", title);
    }

    @Override
    public AlphaTexStructure visitSubtitle(AlphaTexParser.SubtitleContext ctx) {
        String subtitle = getString(ctx.string());
        return createAndSetStr("subtitle", subtitle);
    }

    @Override
    public AlphaTexStructure visitTempo(AlphaTexParser.TempoContext ctx) {
        AlphaTexStructure ret = new AlphaTexStructure();
        ret.setInt("tempo", Integer.parseInt(ctx.INT().getText()));
        return ret;
    }

    @Override
    public AlphaTexStructure visitArtist(AlphaTexParser.ArtistContext ctx) {
        String artist = getString(ctx.string());
        return createAndSetStr("artist", artist);
    }

    @Override
    public AlphaTexStructure visitAlbum(AlphaTexParser.AlbumContext ctx) {
        String album = getString(ctx.string());
        return createAndSetStr("album", album);
    }

    @Override
    public AlphaTexStructure visitWords(AlphaTexParser.WordsContext ctx) {
        String words = getString(ctx.string());
        return createAndSetStr("words", words);
    }

    @Override
    public AlphaTexStructure visitMusic(AlphaTexParser.MusicContext ctx) {
        String music = getString(ctx.string());
        return createAndSetStr("music", music);
    }

    @Override
    public AlphaTexStructure visitCopyright(AlphaTexParser.CopyrightContext ctx) {
        String copyright = getString(ctx.string());
        return createAndSetStr("copyright", copyright);
    }

    @Override
    public AlphaTexStructure visitInstrument(AlphaTexParser.InstrumentContext ctx) {
        String instrument = getString(ctx.string());
        return createAndSetStr("instrument", instrument);
    }

    @Override
    public AlphaTexStructure visitTuning(AlphaTexParser.TuningContext ctx) {
        String tuning = getString(ctx.string());
        return createAndSetStr("tuning", tuning);
    }

    @Override
    public AlphaTexStructure visitCapo(AlphaTexParser.CapoContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        alphaTexStructure.setInt("capo", Integer.parseInt(ctx.INT().getText()));
        return alphaTexStructure;
    }

    @Override
    public AlphaTexStructure visitClef(AlphaTexParser.ClefContext ctx) {
        String clef = getString(ctx.string());
        return createAndSetStr("clef", clef);
    }

    @Override
    public AlphaTexStructure visitKeySignature(AlphaTexParser.KeySignatureContext ctx) {
        String keySignature = getString(ctx.string());
        return createAndSetStr("keySignature", keySignature);
    }

    @Override
    public AlphaTexStructure visitLyrics(AlphaTexParser.LyricsContext ctx) {
        String lyrics = getString(ctx.string());
        return createAndSetStr("lyrics", lyrics);
    }

    @Override
    public AlphaTexStructure visitTimeSignature(AlphaTexParser.TimeSignatureContext ctx) {
        AlphaTexStructure alphaTexStructure = new AlphaTexStructure();
        alphaTexStructure.setInt("tsTop", Integer.parseInt(ctx.INT().get(0).getText()));
        alphaTexStructure.setInt("tsBottom", Integer.parseInt(ctx.INT().get(1).getText()));
        return alphaTexStructure;
    }

    private String getString(List<AlphaTexParser.StringContext> words) {
        StringBuilder attribute = new StringBuilder();
        boolean addSpace;
        for (AlphaTexParser.StringContext word : words) {
            addSpace = !word.getText().equals(".");
            if (addSpace && attribute.length() > 0) {
                attribute.append(' ');
            }
            attribute.append(word.getText());
        }

        return attribute.toString();
    }
}


//\title "Down by the Riverside"
//\subtitle "Arranged by: Brant Adams. B.M.I."
//\tempo 84
//.
//
//\track "Soprano"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G
//\lyrics "Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ _ _"
//r.1 |
//r.2 :4 d3 e3 |
//g3{d}.2 :8 g3{-} a3 |
//b3{d}.2 :8 b3{-} r |
//\ts 2 4 :4 b3 a3 |
//\ts 4 4 g3.1 |
//:8 e3 d3 d3{- d}.2 :8 d3{-} r |
//\ts 2 4 :4 d3 e3 |
//\ts 4 4 g3{d}.2 :8 g3 a3 |
//:2 b3 a3 |
//g3.1 |
//\tempo 88
//\ts 4 4 :2 g3{-} r |
//
//\track "Alto"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G
//\lyrics "Oo _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ Oo _ _ _"
//r.1 |
//r.2 :4 d4 e4 |
//g4.1 |
//g4{- d}.2 :8 g4{-} r |
//\ts 2 4 f4.2 |
//\ts 4 4 :2 e4 c4 |
//:8 c4 d4 d4{-}.2 :8 d4{-} r |
//\ts 2 4 :4 d4 e4 |
//\ts 4 4 g4{d}.2 e4.4 |
//e4.2 :4 e4 c4 |
//c4.1 |
//\tempo 88
//\ts 4 4 :2 b3 r |
//
//\track "Tenor"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G \clef F4
//\lyrics "Oo _ _ _ Oo _ _"
//:1 r | r | r | r | \ts 2 4 r.2 | \ts 4 4 :1 r | r |
//\ts 2 4 :4 d4 c4 |
//\ts 4 4 b3.1 |
//:2 g3 a3 |
//ab3.1 |
//\tempo 88
//\ts 4 4 :2 g3 r |
//
//\track "Bass"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G \clef F4
//\lyrics "Oo _ _ _ _ Oo _ _ _"
//:1 r | r | r | r | \ts 2 4 r.2 | \ts 4 4 :1 r | r | \ts 2 4 r.2 |
//\ts 4 4 :4 g3 f#3 e3 d3 |
//c#3.2 :4 c3 d3 |
//eb3.1 |
//\tempo 88
//\ts 4 4 :2 d3 r |
//
//\track "Piano Upper"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G
//r.8 d6{d}.4 d6{-}.2 |
//r.8 d6{d}.4 d6{-}.2 |
//r.8 d6{d}.4 d6{-}.2 |
//r.8 :4 d6{d} d6{-} :4 (e6 b6) |
//\ts 2 4 :4 d5 a4{-} |
//\ts 4 4 r.8 d6{d}.4 d6{-}.2 |
//r.8 d6{d}.4 d6{-}.2 |
//\ts 2 4 d6{-}.2 |
//\ts 4 4 r.8 d6{d}.4 d6{-}.2 |
//r.4 :16 a4 b4 c#5 e5 f#5.4 :16 a4 c5 e5 f#5 |
//g5.4 :16 ab4 bb4 c5 eb5 :8{tu 3} f5 g5 ab5 :8{tu 3} bb5 c6 eb6 |
//\tempo 88
//\ts 12 8 (a5{d} b5{d} d6{d}).2 a4{d}.2 |
//
//\track "Piano Upper 2"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G
//r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
//r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
//r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
//r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
//\ts 2 4 f4.2 |
//\ts 4 4 r.8 :16 g5 a5 :8 d5 e5 e5{-}.2 |
//r.8 :16 a5 b5 :8 d5 e5 e5{-} a5 d6.4 |
//\ts 2 4 d6{-}.2 |
//\ts 4 4 r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
//r.1 |
//r.1 |
//\tempo 88
//\ts 12 8 :8 g2 d3 g3 a3 b3 d4 a4 d4 b3 a3 g3 d3 |
//
//\track "Piano Lower"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G
//:1 (d4 g4) |
//:1 (d4 g4) |
//:1 (d4 g4) |
//:1 (d4 g4) |
//\ts 2 4 :2 (d4{-} g4{-}) |
//\ts 4 4 :1 (e4 g4) |
//:1 (c4 d4 g4) |
//\ts 2 4 d4.2 |
//\ts 4 4 :2 (d4 g4) (e4 g4) |
//:16 b3 c#4 e4 g4 g4{-}.4 :16 a3 c4 d4 e4 :8 f#4 d4 |
//:16 ab3 c4 eb4 g4 (ab3{- d} c4{- d} eb4{- d} g4{- d}).2 |
//\tempo 88
//\clef F4
//\ts 12 8 :1 g2{d} |
//
//
//\title "Down by the Riverside"
//\subtitle "Arranged by: Brant Adams. B.M.I."
//\tempo 84
//.
//
//\track "Tenor"
//\staff {score} \tuning piano \instrument acousticgrandpiano \ks G \clef F4
//\lyrics "Oo _ _ _ Oo _ _"
//ab3.1 |
//\tempo 88
//\ts 4 4 :2 g3 r |
