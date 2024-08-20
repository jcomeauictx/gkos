//============ Copyright 2010 by Seppo Tiainen ============
// Version: 30 April 2010
//------------ Not all GKOS functions implemented in this demo ------------
// GKOS chording values
var _ = 0x00;
var A = 0x01;
var B = 0x02;
var C = 0x04;
var D = 0x08;
var E = 0x10;
var F = 0x20;
// X (64) and Y (128) are not keys, but chord offsets, especially for Sanskrit
var X = 0x40;
var Y = 0x80;
var GKOS = {"KeyF": A, "KeyD": B, "KeyS": C, "KeyJ": D, "KeyK": E, "KeyL": F};
var mapping = { // chords to character indices
    [A]: 1, // a
    [B]: 2, // b
    [C]: 3, // c
    [D]: 4, // d
    [E]: 5, // e
    [F]: 6, // f
    [_|_|_|D|E|_]: 7, // g
    [A|_|_|D|E|_]: 8, // h
    [_|B|_|D|E|_]: 9, // i
    [_|_|C|D|E|_]: 10, // j
    [_|_|_|_|E|F]: 11, // k
    [A|_|_|_|E|F]: 12, // l
    [_|B|_|_|E|F]: 13, // m
    [_|_|C|_|E|F]: 14, // n
    [A|B|_|_|_|_]: 15, // o
    [A|B|_|D|_|_]: 16, // p
    [A|B|_|_|E|_]: 17, // q
    [A|B|_|_|_|F]: 18, // r
    [_|B|C|_|_|_]: 19, // s
    [_|B|C|D|_|_]: 20, // t
    [_|B|C|_|E|_]: 21, // u
    [_|B|C|_|_|F]: 22, // v
    [_|_|_|D|_|F]: 23, // w
    [A|_|_|D|_|F]: 24, // x
    [_|B|_|D|_|F]: 25, // y
    [_|_|C|D|_|F]: 26, // z
    [A|_|C|_|_|_]: 27, // th
    [A|_|C|D|_|_]: 28, // "that "
    [A|_|C|_|E|_]: 29, // "the "
    [A|_|C|_|_|F]: 30, // "of "
    [_|B|_|_|_|F]: 31, // .
    [_|_|C|_|E|_]: 32, // ,
    [_|_|C|D|_|_]: 33, // !
    [A|_|_|_|_|F]: 34, // ?
    [A|_|_|_|E|_]: 35, // -
    [_|B|_|D|_|_]: 36, // '
    [A|B|_|_|E|F]: 37, // \
    [_|B|C|D|E|_]: 38, // /
    [A|_|C|_|E|F]: 39, // "and "
    [_|B|C|D|_|F]: 40, // "with "
    [A|_|C|D|E|_]: 41, // "to "
};
var gLanguage = "English"; // Current language selection
var basicLanguage = "English"; // Basic (ticked) Language selection
var keyDown = null, keyUp = null; // these functions are set later in the code
var gChars = null;  // holds current language's characters
var gRef = 0; // GKOS Reference number (1-41 only used here)
var urlParameters = new URLSearchParams(location.search);
// default to simplyTimedKey{Up,Down}
var timing = urlParameters.get("timing") || "simple";
console.debug("timing: " + timing);
// the following 6 "chord" variables are used by simplyTimedKey{Down,Up}
// `chord` is a global, changing it to a parameter of outputChar would
// be difficult so leaving it as is.
var chord = 0; //chord value for selecting characters
var chordx = 0; //chord value in realtime
var prevChord = 0; // before press
var prevChordx = 0; // before release
var chord1 = 0; // in case of Chordon
var chord2 = 0; // in case of Chordon
// untimedChord and readyToRead used by untimedKey{Down,Up}
// they also use the global `chord` as noted above.
var untimedChord = 0;
var readyToRead = false;
var myString = "";
var typed = "";
var cursorPos = 0;
var cursorPosAdd = 1;
var symbOn = false;
var numbOn = false;
var shiftOn = false;
var altOn = false;
var ctrlOn = false;
var gOffset = 0;
var gJamoCounter = 0;
//========Timing==============
var cCounter; // stored timer c value
var cCounterx; // stored timer c value
var c=0;
var t;
var timer_is_on = false;
function timedCount() {
    document.getElementById('txt').value=c;
    c = Math.min(c + 1, 255);
    t=setTimeout("timedCount()",10); // count tens of milliseconds
}
function doTimer() {
    c = 0;
    if (!timer_is_on) {
        timer_is_on = true;
        timedCount();
    }
}
function stopCount() {
    clearTimeout(t);
    timer_is_on = false;
    c = 0;
    document.getElementById('txt').value=c;
}
//================================
function clearDisplay() {
    myString = "";
    field.value = "";
    field2.value = myString;
    field.focus();
}
//==================================
function gIncJamoCounter() {
    //JamosToHangul
    gJamoCounter = gJamoCounter + 1 ;
    // Check if that was a second/third middle vowel:
    if (gJamoCounter == 3) { // Passing middle of syllable?
        switch (gRef) { // if another vowel, should not have incremented
            case 1: // a
            case 2: // b
            case 3: // c
            case 4: // d
            case 5: // e
            case 6: // f
            case 7: // g
            case 11: // k
            case 15: // o
            case 19: // s
                gJamoCounter--;
                break;
        } // end switch
    } // end if
    gJamoCounter %= 3;  // reset to zero if at 3
} // end gIncJamoCounter()
function gDecJamoCounter() {
    //JamosToHangul
    gJamoCounter--;
    if (gJamoCounter == -1) gJamoCounter = 2;
}
//==================================
var baseChars = {
    // in the following, \0 is placeholder for "",
    // \v for multi-character entries such as "that ", "the ", ...
    lower:
        "\0abcdefghijklmnopqrstuvwxyz\v\v\v\v." +
        ",!?-'\\/\v\v\v\0\0\0\0\0\0\0\0 \0\0\0\0\t\0\0\0\0\0\0\0\0",
    upper:
        "\0ABCDEFGHIJKLMNOPQRSTUVWXYZ\v\v\v\v:" +
        ';|~_"\u0300\u0301\v\v\v\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
    symbolsLower:
        "\x001234560789#@½&+%=^*$€£([<{)]>}." +
        ",!?-'\\/μ§\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
    symbolsUpper:
        "\x001234560789#@½&+%=^*$€£([<{)]>}:" +
        ';|~_"\u0300\u0301μ§\u030c\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0°\0\0\0\0\0'
};
var base = {
    latin: Object.fromEntries(Array.from(
            baseChars.lower + baseChars.upper +
            baseChars.symbolsLower + baseChars.symbolsUpper
        ).map(function(value, key) {
            return [key, value == "\0" ? "" : value];
        })
    )
};
var patch = {
    danish: {
        27: "ü", 28: "å", 29: "æ", 30: "ø",
        // copied from Finnish, these weren't overwritten for Danish
        39: "\u0308", 40: "§", 41: "\u030c",
        91: "Ü", 92: "Å", 93: "Æ", 94: "Ø",
        103: "\u0308", 104: "ẞ", 105: "\u030c",
        231: "μ", 232: "ß", 233: "\u0302"
    },
    english: {
        27: "th", 28: "that ", 29: "the ", 30: "of ",
        39: "and ", 40: "with ", 41: "to ",
        91: "Th", 92: "That ", 93: "The ", 94: "Of ",
        103: "And ", 104: "With ", 105: "To "
    },
    finnish: {
        27: "ü", 28: "å", 29: "ä", 30: "ö",
        39: "\u0308", 40: "§", 41: "\u030c",
        91: "Ü", 92: "Å", 93: "Ä", 94: "Ö",
        103: "\u0308", 104: "ẞ", 105: "\u030c",
        231: "μ", 232: "ß", 233: "\u0302"
    },
    french: {
        27: "è", 28: "à", 29: "é", 30: "ê",
        37: "\u0300", 38: "\u0301", 39: "\u0308", 40: "ç", 41: "\u0302",
        91: "È", 92: "À", 93: "É", 94: "Ê",
        101: "\\", 102: "/", 103: "\u0308", 104: "Ç", 105: "\u0302",
        229: "\\", 230: "/", 231: "œ", 232: "§", 233: "\u030c"
    },
    german: {
        27: "ü", 28: "å", 29: "ä", 30: "ö",
        39: "\u0308", 40: "ß", 41: "\u030c",
        91: "Ü", 92: "Å", 93: "Ä", 94: "Ö",
        103: "\u0308", 104: "ẞ", 105: "\u030c",
        231: "μ", 232: "§", 233: "\u0302"
    },
    greek: {
        1: "α", 2: "ο", 3: "ς", 4: "δ", 5: "ε", 6: "φ", 7: "γ", 8: "χ",
        9: "η", 10: "ι", 11: "κ", 12: "λ", 13: "μ", 14: "ν", 15: "ω", 16: "π",
        17: "ψ", 18: "ρ", 19: "σ", 20: "τ", 21: "ου",
        22: "β", 23: "\u0301", 24: "ξ", 25: "υ",
        26: "ζ", 27: "θ", 28: "", 29: "ει",
        30: "", 39: "\u0308", 40: "§", 41: "\u0302",
        65: "Α", 66: "Ο", 67: "ς", 68: "Δ", 69: "Ε", 70: "Φ", 71: "Γ", 72: "Χ",
        73: "Η", 74: "Ι", 75: "Κ", 76: "Λ", 77: "Μ", 78: "Ν", 79: "Ω", 80: "Π",
        81: "Ψ", 82: "Ρ", 83: "Σ", 84: "Τ",
        85: "Ου", 86: "Β", 87: "\u0301", 88: "Ξ",
        89: "Υ", 90: "Ζ", 91: "Θ", 92: "",
        93: "Ει", 94: "", 103: "\u0308", 104: "§", 105: "\u0302"
    },
    icelandic: {
        27: "þ", 28: "å", 29: "æ", 30: "ö",
        39: "\u0308", 40: "ð", 41: "\u0301",
        91: "Þ", 92: "Å", 93: "Æ", 94: "Ö",
        103: "\u0308", 104: "Ð", 105: "\u030c",
        231: "μ", 232: "§", 233: "\u030c"
    },
    korean: {
        1: "\u1161", 2: "\u1175", 3: "\u1165", 4: "\u1169",
        5: "\u1173", 6: "\u116e", 7: "\u116d", 8: "\u110f",
        9: "\u1100", 10: "\u1101", 11: "\u1172", 12: "\u1110",
        13: "\u1103", 14: "\u1104", 15: "\u1163", 16: "\u1106",
        17: "\u1107", 18: "\u1108", 19: "\u1167", 20: "\u110e",
        21: "\u110c", 22: "\u110d", 23: "", 24: "\u110b",
        25: "\u1109", 26: "\u110a", 27: "\u1102", 28: "\u1105",
        29: "\u1106", 30: "\u1112",
        39: "and ", 40: "with ", 41: "to ",
        // Ref + 64 Tail consonants
        // lead:  1 (U+1100/dec4352) - 19 (U+1112)
        // vowel: 1 (U+1161/dec4449) - 21 (U+1175)
        // tail:  1 (U+11A8/dec4520) - 27 (U+11C2)
        // Code point of Hangul =
        //  (uTail-4519) + (uVowel-4449)*28 + (uLead-4352)*588 + 44032
        65: "\u1161", 66: "\u1175", 67: "\u1165", 68: "\u1169",
        69: "\u1173", 70: "\u116e", 71: "\u116d", 72: "\u118f",
        73: "\u11a8", 74: "\u11a9", 75: "\u1172", 76: "\u11c0",
        77: "\u11ae", 78: "\u11c8", 79: "\u1163", 80: "\u11b7",
        81: "\u11b8", 82: "\u11b9", 83: "\u1167", 84: "\u11be",
        85: "\u11bd", 86: "\u11de", 87: "", 88: "\u11bc",
        89: "\u11ba", 90: "\u11bb", 91: "\u11ab", 92: "\u11af",
        93: "\u11b7", 94: "\u11c2",
        103: "And ", 104: "With ", 105: "To "
    },
    russian: {
        1: "а", 2: "б", 3: "ц", 4: "д", 5: "е", 6: "ф", 7: "г", 8: "х",
        9: "и", 10: "й", 11: "к", 12: "л", 13: "м", 14: "н", 15: "о", 16: "п",
        17: "ж", 18: "р", 19: "с", 20: "т", 21: "у", 22: "в", 23: "ш", 24: "ч",
        25: "ы", 26: "з", 27: "щ", 28: "ю", 29: "э", 30: "я", 39: "ъ", 40: "ь",
        41: "\u0308",
        65: "А", 66: "Б", 67: "Ц", 68: "Д", 69: "Е", 70: "Ф", 71: "Г", 72: "Х",
        73: "И", 74: "Й", 75: "К", 76: "Л", 77: "М", 78: "Н", 79: "О", 80: "П",
        81: "Ж", 82: "Р", 83: "С", 84: "Т", 85: "У", 86: "В", 87: "Ш", 88: "Ч",
        89: "Ы", 90: "З", 91: "Щ", 92: "Ю", 93: "Э", 94: "Я",
        103: "Ъ", 104: "Ь", 105: "\u0308"
    },
    spanish: {
        27: "ú", 28: "á", 29: "é", 30: "ó",
        39: "ñ", 40: "\u00fc", 41: "í",
        91: "Ú", 92: "Á", 93: "É", 94: "Ó",
        97: "\u00a1", 98: "\u00bf",
        103: "Ñ", 104: "\u00dc", 105: "Í",
        231: "\u0302", 232: "\u0308", 233: "\u00aa",
        250: "\u00ba"
    }
};
var chars = {
    danish: Object.assign({}, base.latin, patch.danish),
    english: Object.assign({}, base.latin, patch.english),
    finnish: Object.assign({}, base.latin, patch.finnish),
    french: Object.assign({}, base.latin, patch.french),
    german: Object.assign({}, base.latin, patch.german),
    greek: Object.assign({}, base.latin, patch.greek),
    icelandic: Object.assign({}, base.latin, patch.icelandic),
    korean: Object.assign({}, base.latin, patch.korean),
    russian: Object.assign({}, base.latin, patch.russian),
    // sanskrit handled by different engine, the following is unused
    sanskrit: Object.assign({}, base.latin, patch.english),
    spanish: Object.assign({}, base.latin, patch.spanish)
};
//===================================
onload = function() {
    gChars = chars.english;
    chord = 0;
    // field2 is where the typed text shows
    field2 = document.getElementById('text_field2');
    // info2 shows current state of keyboard (shift, symb etc.) or language
    info2 = document.getElementById('info_field2');
    field2.onkeydown = keyDown;
    field2.onkeyup = keyUp;
    field2.focus();
    usedLanguage(); // update to ticked laguage
    stopCount(); // reset counter display
    if (urlParameters.get("action") == "dump") {
        field2.value = JSON.stringify(chars, null, 2);
    }
};
//==========================
function doGetCaretPosition (field2) {
    var CaretPos = 0;    // IE Support
    if (document.selection) {
    field2.focus ();
        var Sel = document.selection.createRange ();
        Sel.moveStart ('character', -field2.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (field2.selectionStart || field2.selectionStart == '0')
        CaretPos = field2.selectionStart;
    return (CaretPos);
}
function setCaretPosition(field2, pos){
    if(field2.setSelectionRange)
    {
        field2.focus();
        field2.setSelectionRange(pos,pos);
    }
    else if (field2.createTextRange) {
        var range = field2.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
//--------------------------
function checkShifts(){
    if(shiftOn){shiftOn = false; info2.value = gLanguage;}
    if(symbOn){symbOn = false; info2.value = gLanguage;}
    if(altOn){altOn = false; info2.value = gLanguage;}
    if(ctrlOn){ctrlOn = false; info2.value = gLanguage;}
}
//---------------------------
function clearScreen(){
    myString = "";
    field2.value = myString;
    field2.focus();
    gJamoCounter = 0;
}
//---------------------------
// When a language is selected by ticking a radio button:
function usedLanguage() {
    chosen = "";
    len = document.fLanguage.gLanguage.length;
    for (i = 0; i <len; i++) {
        if (document.fLanguage.gLanguage[i].checked) {
            chosen = document.fLanguage.gLanguage[i].value;
        }
    }
    if (chosen == "") {
        return null;
    } else {
        gLanguage = chosen; // Current language
        basicLanguage = chosen; // Ticked language
        gChars = chars[gLanguage.toLowerCase()];
        if (gLanguage == "Korean"){
            gJamoCounter = 0;
            document.getElementById("decal").src = "../hangeul_roman.png";
        } else {
            //Update the layout picture
            document.getElementById("decal").src = "../" +
                gLanguage.toLowerCase() + "2.png";
        }
    } // end if (chosen == "")
    info2.value = gLanguage;
    field2.focus();
} // end function usedLanguage()
//--------------------
// see pages 19-21 of gkos_spec_v314.pdf for discussion on untimed and timed
// key processing. the way it's done in the original javascript don't match
// either.
function simplyTimedKeyDown(e){
    var thisKey = e ? e.code : window.event.code;
    var keyMask = 0;
    prevChord = chord;
    cCounter = c; // store timer value before clearing it
    if(chordx == 0) {
        // starting a whole new combo or chordon
        chord1 = 0;
        chord2 = 0;
    }
    // NOTE: SDF=CBA and JKL=DEF: First set of 3 is INTENTIONALLY REVERSED
    // I believe it's to get used to the same layout as a hardware GKOS
    // keyboard, held with thumbs and little fingers, left index finger
    // over C and right index over F:
    // /-----\
    // -A   D-
    // -B   E-
    // -C   F-
    // \-----/
    keyMask = GKOS[thisKey];
    if (keyMask) {
        console.debug("processing keydown " + thisKey + ", mask: " + keyMask);
        if ((chordx & keyMask) == 0) {
            chordx |= keyMask;
            chord |= keyMask;
            console.debug("chordx now: " + chordx + ", chord: " + chord);
            doTimer();
        } else {
            console.log("chordx already " + chordx + ": nothing to do");
        }
        // all other keys ignored
    }
    // ===========Vowel detection (for Sanskrit only)============
    if (cCounter >= 10) { // <== The exact delay required  can be adjusted here
        // This is the 10 ms timer count to separate vowels and consonants
        // (e.g. a Typical value c = 8 gives 8 x 10 ms = 80 ms)
        // Vowels have been detected due to delay. Study them further:
        chord1 = prevChord; // chord1 and chord2 in case of a Chordon
        if (gLanguage == "Sanskrit") {
            switch (prevChord) {
                case D:
                case E:
                case F:
                case (D|E|_):
                case (D|_|F):
                case (_|E|F):
                case (D|E|F):
                    chord |= Y;
                    break;
                // The rest are left-hand-first chords:
                default: chord |= X; // add 64, vowel detected by timer
                // (3 + 3 keys used), left hand first
            } // end switch(prevChord)
        } // end if (gLanguage == "Sanskrit")
    } // end if (cCounter >= 10)
    return false; // Cancel the original keydown event
} // end simplyTimedKeyDown(e)
//---------------------------
function simplyTimedKeyUp(e) {
    thisKey = e ? e.code : window.event.code;
    var keyMask = 0;
    cCounterx = c; // store timer value before clearing it
    prevChordx = chordx;
    if (GKOS[thisKey]) {
        keyMask = ~GKOS[thisKey];
        console.debug("processing keyup " + thisKey + ", mask: " + keyMask);
        chordx &= keyMask;
    } // all other keys ignored
    chord2 = 0; // default
    // a second chord after a delayed relase (set dealay here 10...20)
    if (cCounterx >= 15) {chord2 = prevChordx;}
    //chord2 = 3; // TEST
    doTimer(); // Reset Timer for each key up event too
    // Stop and reset timer when all keys are released
    if(chordx == 0){stopCount();}
    // only if SDF/JKL pressed & released:
    if (keyMask != 0) {
        // due to delayed press
//      if(chord1 != 0){
//            chord = chord1;
//            outputChar();
//      }
        // second character due to delayed release of keys:
        if((chord2 >= 0) && (chord == 0)) { // chord = 0 means one was sent
            chord = chord2;
            outputChar();
        }
        outputChar(); // original character
    } // end outer `if`
    field2.scrollTop = field2.scrollHeight;  // keep bottom line visible
    return true;
} // end simplyTimedKeyUp()
// begin untimed keychord processing
/* the description on page 20 of gkos_spec_v314.pdf says to read chord
 * value "immediately before the key went up", which is of course
 * impossible, as the event has already occurred. so what we will do
 * instead is to build the chord with each keydown event */
function untimedKeyDown(event) {
    var thisKey = event ? event.code : window.event.code;
    untimedChord |= GKOS[thisKey];
    readyToRead = true;
    return false; // disable default and bubbling
}
function untimedKeyUp(event) {
    if (readyToRead) {
        readyToRead = false;
        chord = untimedChord;
        outputChar();
        untimedChord = 0;
    }
    return false; // disable default and bubbling
}
function timedKeyDown(event) {
    console.error("timedKeyDown not yet implemented");
}
function timedKeyUp(event) {
    console.error("timedKeyUp not yet implemented");
}
[keyDown, keyUp] = {
    "simple": [simplyTimedKeyDown, simplyTimedKeyUp],
    "none": [untimedKeyDown, untimedKeyUp],
    "timed": [timedKeyDown, timedKeyUp]
}[timing];
//-------------------------
function outputChar() {
    field = document.getElementById('text_field2');
    if (gLanguage == "Sanskrit" && numbOn == false) {
        goSanskrit();
        field2.scrollTop = field2.scrollHeight;  // keep bottom line visible
        return true;
    }
    cursonPosAdd = 1; //default entry length
    gOffset = 0; // default
    if(shiftOn){gOffset = X;}
    if(numbOn){gOffset = Y;}
    if(symbOn){gOffset = (X|Y);}
    if (gLanguage == "Korean") { //  use a tail consonant?
        if(gJamoCounter == 2) {gOffset = X;} // yes
    }
    gRef = 0; // Default (only values 1 to 41 are updated below)
    console.debug("outputChar() with chord " + chord);
    var character = "";
    switch (chord) {
        case (A|B|_|D|_|F):
            // Ins(ert) or, in SYMB mode, "°" or (Spanish only) "º"
            // these are at offset 250, which is 58 + 64 + 128
            character = gChars[58+gOffset]; // Ins (char for SYMB only)
            break;
        case (D|E|F):
            character = " "; // Space
            gJamoCounter = 2; // means counter will turn to zero
            break;
        case (A|B|C):
            // backspace
            myString = myString.substring(0, myString.length-1);
            field2.value = myString;
            gDecJamoCounter();
            chord = 0; // this is to return without adding any char
            break;
        case (A|B|C|D|E|F):
            character = '';  // abc123
            if(numbOn) {
                numbOn = false; info2.value = gLanguage; gJamoCounter = 0;
            } else {
                numbOn = true;
                if (altOn) {
                    if(gLanguage !== basicLanguage) {
                        gLanguage = basicLanguage;
                    } else {
                        gLanguage = "English";
                    }
                    gChars = chars[gLanguage.toLowerCase()];
                    info2.value = gLanguage;
                    altOn = false;
                    numbOn = false;
                }
            } // end of else
            chord = 0;
            gJamoCounter = 2; // means counter will turn to zero
            break;
        case (_|B|_|_|E|_): character = '';  // Shift
            if (shiftOn) {
                shiftOn = false;
            } else {
                shiftOn = true; info2.value = "Shift";
            }
            chord = 0;
            break;
        case (A|_|C|D|_|F): character = '';  // Symb
            if (symbOn) {
                symbOn = false;
            } else {
                symbOn = true; info2.value = "SYMB";
            }
            chord = 0;
            break;
        case (A|B|C|_|E|F): character = 'Alt';  //
            if (altOn) {
                altOn = false;
            } else {
                altOn = true; info2.value = "Alt";
            }
            chord = 0;
            break;
        case (A|B|C|D|_|F): character = 'Ctrl';  //
            if (ctrlOn) {
                ctrlOn = false;
            } else {
                ctrlOn = true; info2.value = "Ctrl";
            }
            chord = 0;
            break;
        case (A|B|_|D|E|F):
            character = String.fromCharCode(13).toLowerCase(); //Enter
            break;
        case (A|B|C|D|_|_): // Left Arrow
            cursorPos = doGetCaretPosition (field2) - 1;
            setCaretPosition(field2, cursorPos);
            chord = 0; // this is to return without adding any char
            break;
        case (A|_|_|D|E|F): // Right Arrow
            cursorPos = doGetCaretPosition (field2) + 1;
            setCaretPosition(field2, cursorPos);
            chord = 0; // this is to return without adding any char
            break;
        case (A|B|C|_|_|F): // Home
            cursorPos = 0;
            setCaretPosition(field2, cursorPos);
            chord = 0; // this is to return without adding any char
            break;
        case (_|_|C|D|E|F): // End
            cursorPos = myString.length;
            setCaretPosition(field2, cursorPos);
            chord = 0; // this is to return without adding any char
            break;
        case (_|_|_|D|_|F):
            gJamoCounter = 2; // This is Next Syllable key as well
            // fall through to default, for normal character mapping
        default:
            gRef = mapping[chord] || 0;
            character = gChars[gOffset + gRef];
    } // end switch(chord)
    cursorPosAdd = character.length;
    cursorPos = doGetCaretPosition (field2); // always get cursor position first
    if (chord != 0) {
        //myString = myString + character
        myString = myString.substring(0, cursorPos) + character +
            myString.substring(cursorPos, myString.length);
        field2.value = myString;
        setCaretPosition(field2, cursorPos + cursorPosAdd);
        if (gLanguage == "Korean") {
            gIncJamoCounter();
        }
        checkShifts();
    }
    chord = 0;
} // end outputChar
//------------------------
function goSanskrit() {
    field = document.getElementById('text_field2');
    cursonPosAdd = 1; //default entry length
    gOffset = 0; // default
    switch (chord) {                        //  04.02.01-08.16.32
        // ==================================================================
        //vowels, maatraas, others
        case  73: character = '\u094d';   break; //a   64 gets added
        case  81: character = '\u093e';  break; //aa  64 gets added
        case 137: character = '\u0905';  break; //a  128 gets added
        case 145: character = '\u0906';  break; //aa 128 gets added
        case   89: character = '\u093d'; break; //.
        case  113: character = '\u0903'; break; //..
        case 153: character = '\u0964';  break; //
        case 177: character = '\u0965';  break; //
        case  74: character = '\u093f';  break; //ii
        case  82: character = '\u0940';  break; //i
        case 138: character = '\u0907';  break; //
        case 146: character = '\u0908';  break; //
        case  90: character = '\u0962';   break; //lri
        case 114: character = '\u0963';   break; //lrii
        case 154: character = '\u090c';  break; //
        case 178: character = '\u0961';  break; //
        case  76: character = '\u0941';   break; //
        case  84: character = '\u0942';   break; //
        case 140: character = '\u0909';  break; //
        case 148: character = '\u090a';  break; //
        case  92: character = '\u0902';   break; //om
        case 116: character = '\u093c';   break; //ung
        case 156: character = '\u0950';  break; // ok  8+16+4 +128 or JK -> JLS
        case 180: character = '\u0901';   break; // ok    16+32+4 +128
        case  75: character = '\u0947';   break; //
        case  83: character = '\u0948';   break; //
        case 139: character = '\u090f';  break; //
        case 147: character = '\u0910';  break; //
        case  91: character = '\u0945';   break; //e
        case 115: character = '\u0946';   break; //ee
        case 155: character = '\u090d';  break; //e
        case 179: character = '\u090e';  break; //ee
        case  78: character = '\u094b';  break; //
        case  86: character = '\u094c';  break; //
        case 142: character = '\u0913';  break; //
        case 150: character = '\u0914';  break; //
        case  94: character = '\u0949';  break; //2 4 8  16 64
        case 118: character = '\u094a';  break; //2 4 16 32 64
        case 158: character = '\u0911';  break; //2 4 8  16 128
        case 182: character = '\u0912';  break; //
        case  77: character = '\u0943';   break; //
        case  85: character = '\u0944';   break; //
        case 141: character = '\u090b';  break; //
        case 149: character = '\u0960';  break; //
        case 157: character = 'zwj'; break; // 1 4 8+16 +128 or JKL -> JKLS
        case 181: character = 'zwnj'; break; // 1 4 16+32+128 or JKL -> JKLS
        case 161: character = 'LF'; break; // 32+1 +128
        case 162: character = 'LD'; break; // 32+2 +128
        case 164: character = 'LS'; break; // 32+4 +128
        case 169: character = 'JLF'; break; //
        case 170: character = 'JLD'; break; // ok  8+32+2 +128 or JL -> JLD
        case 172: character = 'JLS'; break; // ok  8+32+4 +128 or JL -> JLD
        case 185: character = 'JKLF'; break; // ok 8+16+32+1 +128 or JKL -> JKLF
        case 186: character = 'JKLD'; break; // ok 8+16+32+2 +128 or JKL -> JKLD
        case 188: character = 'JKLS'; break; // ok 8+16+32+4 +128 or JKL -> JKLS
        //====================================
        //consonants :
        //case  1: character = "\u1100" ;    break // gchar[1,1,1,1]
        case  1: character = '\u0915' ;  break; // gchar[1,1,1,1]
        case  9: character = '\u0916' ;  break; //
        case 17: character = '\u0917';   break;  //
        case 33: character = '\u0918' ;  break; //
        case 57: character = '\u0919' ;  break; //
        case 25: character = '\u0958' ;  break; //
        case 49: character = '\u0959' ;  break; //
        case 41: character = '\u095a' ;  break; //
        case  2: character = '\u091a' ;  break; //
        case 10: character = '\u091b' ;  break; //
        case 18: character = '\u091c' ;  break; //
        case 34: character = '\u091d' ;  break; //
        case 58: character = '\u091e' ;  break; //
        case 26: character = '\u095b' ;  break; //
        case  4: character = '\u091f' ;  break; //
        case 12: character = '\u0920' ;  break; //
        case 20: character = '\u0921' ;  break; //
        case 36: character = '\u0922' ;  break; //
        case 60: character = '\u0923' ;  break; //
        case 28: character = '\u095c' ;  break; //
        case 52: character = '\u095d' ;  break; //
        case  3: character = '\u0924' ;  break; //
        case 11: character = '\u0925' ;  break; //
        case 19: character = '\u0926' ;  break; //
        case 35: character = '\u0927' ;  break; //
        case 59: character = '\u0928' ;  break; //
        case 27: character = '\u0929' ;  break; //
        case  6: character = '\u092a' ;  break; //
        case 14: character = '\u092b' ;  break; //
        case 22: character = '\u092c' ;  break; //
        case 38: character = '\u092d' ;  break; //
        case 62: character = '\u092e' ;  break; //
        case 30: character = '\u095e' ;  break; //
        case  7: character = '\u092f' ;  break; //
        case 15: character = '\u0930' ;  break; //
        case 23: character = '\u0932' ;  break; //
        case 39: character = '\u0935' ;  break; //
        case 31: character = '\u095f' ;  break; //
        case 55: character = '\u0931' ;  break; //
        case 47: character = '\u0933' ;  break; //
        case 46: character = '\u0934' ;  break; // Changed from 63 (=abc123 from now on) to 46
        case  5: character = '\u0936' ;  break; //
        case 13: character = '\u0937' ;  break; //
        case 21: character = '\u0938' ;  break; //
        case 37: character = '\u0939' ;  break; //
        case 29: character = '\u0915\u094d\u0937' ; break; //
        case 53: character = '\u0924\u094d\u0930' ; break; //
        case 45: character = '\u091c\u094d\u091e' ; break; //
        case  8: character = '    ' ;   break; //tab
        case 32: myString = myString.substring(0, myString.length-1); character = '' ;break; // new line
        case 16: character = " ";   break; // space
        case 56: character = String.fromCharCode(13); break; // .toLowerCase(); //Enter also '\n' '\r'
        // TODO:
        case 63: character = "123"; numbOn = true;  info2.value = "123"; chord = 0 ;
            break;  // enter standard numbers mode
        case 61: character = "abc"; gLanguage = "English";  info2.value = gLanguage; chord = 0;
            break; // enter English mode
        default: character = '';
    } // end switch
    cursorPosAdd = character.length;
    cursorPos = doGetCaretPosition (field2); // always get cursor position first
    if (chord != 0){
        //myString = myString + character
        myString = myString.substring(0, cursorPos) + character + myString.substring(cursorPos, myString.length);
        field2.value = myString;
        setCaretPosition(field2, cursorPos + cursorPosAdd);
        //checkShifts()
    }  // end if (chord != 0)
    chord = 0;
} // end goSanskrit()
// vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
