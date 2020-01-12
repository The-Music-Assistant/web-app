import alphatex.ParserOutput;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;

public class AlphaTexTranslator {
    static final String text = "\\title \"Down by the Riverside\"\n" +
            "\\subtitle \"Arranged by: Brant Adams. B.M.I.\"\n" +
            "\\tempo 84\n" +
            ".\n" +
            "\n" +
            "\\track \"Soprano\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G\n" +
            "\\lyrics \"Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ _ _\"\n" +
            "r.1 |\n" +
            "r.2 :4 d3 e3 |\n" +
            "g3{d}.2 :8 g3{-} a3 |\n" +
            "b3{d}.2 :8 b3{-} r |\n" +
            "\\ts 2 4 :4 b3 a3 |\n" +
            "\\ts 4 4 g3.1 |\n" +
            ":8 e3 d3 d3{- d}.2 :8 d3{-} r |\n" +
            "\\ts 2 4 :4 d3 e3 |\n" +
            "\\ts 4 4 g3{d}.2 :8 g3 a3 |\n" +
            ":2 b3 a3 |\n" +
            "g3.1 |\n" +
            "\\tempo 88\n" +
            "\\ts 4 4 :2 g3{-} r |\n" +
            "\n" +
            "\\track \"Alto\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G\n" +
            "\\lyrics \"Oo _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ Oo _ _ _\"\n" +
            "r.1 |\n" +
            "r.2 :4 d4 e4 |\n" +
            "g4.1 |\n" +
            "g4{- d}.2 :8 g4{-} r |\n" +
            "\\ts 2 4 f4.2 |\n" +
            "\\ts 4 4 :2 e4 c4 |\n" +
            ":8 c4 d4 d4{-}.2 :8 d4{-} r |\n" +
            "\\ts 2 4 :4 d4 e4 |\n" +
            "\\ts 4 4 g4{d}.2 e4.4 |\n" +
            "e4.2 :4 e4 c4 |\n" +
            "c4.1 |\n" +
            "\\tempo 88\n" +
            "\\ts 4 4 :2 b3 r |\n" +
            "\n" +
            "\\track \"Tenor\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G \\clef F4\n" +
            "\\lyrics \"Oo _ _ _ Oo _ _\"\n" +
            ":1 r | r | r | r | \\ts 2 4 r.2 | \\ts 4 4 :1 r | r |\n" +
            "\\ts 2 4 :4 d4 c4 |\n" +
            "\\ts 4 4 b3.1 |\n" +
            ":2 g3 a3 |\n" +
            "ab3.1 |\n" +
            "\\tempo 88\n" +
            "\\ts 4 4 :2 g3 r |\n" +
            "\n" +
            "\\track \"Bass\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G \\clef F4\n" +
            "\\lyrics \"Oo _ _ _ _ Oo _ _ _\"\n" +
            ":1 r | r | r | r | \\ts 2 4 r.2 | \\ts 4 4 :1 r | r | \\ts 2 4 r.2 |\n" +
            "\\ts 4 4 :4 g3 f#3 e3 d3 |\n" +
            "c#3.2 :4 c3 d3 |\n" +
            "eb3.1 |\n" +
            "\\tempo 88\n" +
            "\\ts 4 4 :2 d3 r |\n" +
            "\n" +
            "\\track \"Piano Upper\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G\n" +
            "r.8 d6{d}.4 d6{-}.2 |\n" +
            "r.8 d6{d}.4 d6{-}.2 |\n" +
            "r.8 d6{d}.4 d6{-}.2 |\n" +
            "r.8 :4 d6{d} d6{-} :4 (e6 b6) |\n" +
            "\\ts 2 4 :4 d5 a4{-} |\n" +
            "\\ts 4 4 r.8 d6{d}.4 d6{-}.2 |\n" +
            "r.8 d6{d}.4 d6{-}.2 |\n" +
            "\\ts 2 4 d6{-}.2 |\n" +
            "\\ts 4 4 r.8 d6{d}.4 d6{-}.2 |\n" +
            "r.4 :16 a4 b4 c#5 e5 f#5.4 :16 a4 c5 e5 f#5 |\n" +
            "g5.4 :16 ab4 bb4 c5 eb5 :8{tu 3} f5 g5 ab5 :8{tu 3} bb5 c6 eb6 |\n" +
            "\\tempo 88\n" +
            "\\ts 12 8 (a5{d} b5{d} d6{d}).2 a4{d}.2 |\n" +
            "\n" +
            "\\track \"Piano Upper 2\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G\n" +
            "r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |\n" +
            "r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |\n" +
            "r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |\n" +
            "r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |\n" +
            "\\ts 2 4 f4.2 |\n" +
            "\\ts 4 4 r.8 :16 g5 a5 :8 d5 e5 e5{-}.2 |\n" +
            "r.8 :16 a5 b5 :8 d5 e5 e5{-} a5 d6.4 |\n" +
            "\\ts 2 4 d6{-}.2 |\n" +
            "\\ts 4 4 r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |\n" +
            "r.1 |\n" +
            "r.1 |\n" +
            "\\tempo 88\n" +
            "\\ts 12 8 :8 g2 d3 g3 a3 b3 d4 a4 d4 b3 a3 g3 d3 |\n" +
            "\n" +
            "\\track \"Piano Lower\"\n" +
            "\\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G\n" +
            ":1 (d4 g4) |\n" +
            ":1 (d4 g4) |\n" +
            ":1 (d4 g4) |\n" +
            ":1 (d4 g4) |\n" +
            "\\ts 2 4 :2 (d4{-} g4{-}) |\n" +
            "\\ts 4 4 :1 (e4 g4) |\n" +
            ":1 (c4 d4 g4) |\n" +
            "\\ts 2 4 d4.2 |\n" +
            "\\ts 4 4 :2 (d4 g4) (e4 g4) |\n" +
            ":16 b3 c#4 e4 g4 g4{-}.4 :16 a3 c4 d4 e4 :8 f#4 d4 |\n" +
            ":16 ab3 c4 eb4 g4 (ab3{- d} c4{- d} eb4{- d} g4{- d}).2 |\n" +
            "\\tempo 88\n" +
            "\\clef F4\n" +
            "\\ts 12 8 :1 g2{d} |";
    public static void main(String[] args){
        AlphaTexParser alphaTexParser = new AlphaTexParser(new CommonTokenStream(new AlphaTexLexer(CharStreams.fromString(text))));
        TexVisitor texVisitor = new TexVisitor(alphaTexParser.alphaTex());

        ParserOutput parserOutput = new ParserOutput(texVisitor.alphaTexStructure);
        parserOutput.parse();
        System.out.println(parserOutput);
    }
}