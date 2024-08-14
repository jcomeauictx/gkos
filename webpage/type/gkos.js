//============ Copyright 2010 by Seppo Tiainen ============
// Version: 30 April 2010
//------------ Not all GKOS functions implemented in this demo ------------

var gLanguage = "English"; // Current language selection
var basicLanguage = "English"; // Basic (ticked) Language selection
var gChars = new Array(256);  // holds current language's characters

var chord = 0; //chord value for selecting characters
var chordx = 0; //chord value in realtime
var gRef = 0; // GKOS Reference number (1-41 only used here)
var prevChord = 0; // before press
var prevChordx = 0; // before release
var chord1 = 0; // in case of Chordon
var chord2 = 0; // in case of Chordon
var gAdown = false;
var gBdown = false;
var gCdown = false;
var gDdown = false;
var gEdown = false;
var gFdown = false;

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
            case 1: gJamoCounter = gJamoCounter - 1 ; break; //a-f
            case 2: gJamoCounter = gJamoCounter - 1 ; break;
            case 3: gJamoCounter = gJamoCounter - 1 ; break;
            case 4: gJamoCounter = gJamoCounter - 1 ; break;
            case 5: gJamoCounter = gJamoCounter - 1 ; break;
            case 6: gJamoCounter = gJamoCounter - 1 ; break;
            case 7: gJamoCounter = gJamoCounter - 1 ; break; //g
            case 11: gJamoCounter = gJamoCounter - 1 ; break; //k
            case 15: gJamoCounter = gJamoCounter - 1 ; break; //o
            case 19: gJamoCounter = gJamoCounter - 1 ; break; //s
        }	
    }
    gJamoCounter %= 3;  // reset to zero if at 3
    //info2.value = gJamoCounter; // debug
}

function gDecJamoCounter() {
    //JamosToHangul
    gJamoCounter--;
    if (gJamoCounter == -1) gJamoCounter = 2;
    //info2.value = gJamoCounter; // debug
}

//==================================
function pickKoreanCharacters() {
    gChars[0]="";  // [0] not used
    gChars[1]="\u1161"; //a
    gChars[2]="\u1175";
    gChars[3]="\u1165";
    gChars[4]="\u1169";
    gChars[5]="\u1173";
    gChars[6]="\u116e";
    gChars[7]="\u116d"; //g
    gChars[8]="\u110f";
    gChars[9]="\u1100"; //dec 4352
    gChars[10]="\u1101";
    gChars[11]="\u1172"; //k
    gChars[12]="\u1110";
    gChars[13]="\u1103";
    gChars[14]="\u1104";
    gChars[15]="\u1163"; //o
    gChars[16]="\u1106";
    gChars[17]="\u1107";
    gChars[18]="\u1108";
    gChars[19]="\u1167"; //s
    gChars[20]="\u110e";
    gChars[21]="\u110c";
    gChars[22]="\u110d";
    gChars[23]=""; //w
    gChars[24]="\u110b";
    gChars[25]="\u1109";
    gChars[26]="\u110a";

    gChars[27]="\u1102"; // th
    gChars[28]="\u1105"; // that
    gChars[29]="\u1106"; // the
    gChars[30]="\u1112"; // of

    //---- Ref + 64 Tail consonants
    // Code point of Hangul = tail + (vowel−1)*28 + (lead−1)*588 + 44032 
    // lead:  1 (U+1100/dec4352) - 19 (U+1112)
    // vovel: 1 (U+1161/dec4449) - 21 (U+1175)
    // tail:  1 (U+11A8/dec4520) - 27 (U+11C2)
    // Code point of Hangul =
    //  (uTail-4519) + (uVowel−4449)*28 + (uLead−4352)*588 + 44032 
    // a.substring(2,5)
    // function d2h(d) {return d.toString(16);}
    // function h2d(h) {return parseInt(h,16);} 
    //    function d2h(d) { // always return hex with 4 characters
    //    var iString = "0000" + d.toString(16);
    //    var iLen = iString.length;
    //    return iString.substring(iLen - 4, iLen);}

    gChars[65]="\u1161";
    gChars[66]="\u1175";
    gChars[67]="\u1165";
    gChars[68]="\u1169";
    gChars[69]="\u1173";
    gChars[70]="\u116e";
    gChars[71]="\u116d"; //g
    gChars[72]="\u118f";
    gChars[73]="\u11a8";
    gChars[74]="\u11a9";
    gChars[75]="\u1172"; //k
    gChars[76]="\u11c0";
    gChars[77]="\u11ae";
    gChars[78]="\u11c8"; //??
    gChars[79]="\u1163"; //o
    gChars[80]="\u11b7";
    gChars[81]="\u11b8";
    gChars[82]="\u11b9"; //??
    gChars[83]="\u1167"; //s
    gChars[84]="\u11be";
    gChars[85]="\u11bd";
    gChars[86]="\u11de"; //??
    gChars[87]=""; //w (\u200b)
    gChars[88]="\u11bc"; //??
    gChars[89]="\u11ba";
    gChars[90]="\u11bb";

    gChars[91]="\u11ab"; // th
    gChars[92]="\u11af"; // that
    gChars[93]="\u11b7"; // the
    gChars[94]="\u11c2"; // of
}

//==================================
function pickLatinCharacters() {
    gChars[0]="";  // [0] not used
    gChars[1]="a";
    gChars[2]="b";
    gChars[3]="c";
    gChars[4]="d";
    gChars[5]="e";
    gChars[6]="f";
    gChars[7]="g";
    gChars[8]="h";
    gChars[9]="i";
    gChars[10]="j";
    gChars[11]="k";
    gChars[12]="l";
    gChars[13]="m";
    gChars[14]="n";
    gChars[15]="o";
    gChars[16]="p";
    gChars[17]="q";
    gChars[18]="r";
    gChars[19]="s";
    gChars[20]="t";
    gChars[21]="u";
    gChars[22]="v";
    gChars[23]="w";
    gChars[24]="x";
    gChars[25]="y";
    gChars[26]="z";

    gChars[27]="th"; //ü
    gChars[28]="that "; //å
    gChars[29]="the ";  //ä
    gChars[30]="of ";   //ö

    // grave U+0300  acute U+0301  circumflex U+0302 (--̂  )
    // umlaut U+0308 (--̈  )  tilde U+0303 (--̃  )
    // breve/short U+0306 (--̆  )  hachek U+030C (--̌  )  
    // à/À  è/È  ì   ò  ù/Ù  -  á  é/É  í  ó  ú  -  ñ/Ñ - ê/Ê
    // œ/Œ  -  ô/Ô  -  ç/Ç
    // Spanish: ¿ ¡ º(Masculine Ordinal u+00BA) ª(Feminine Ordinal u+00AA)
    //          Á É Í Ó Ú Ñ Ü á é í ó ú ñ ü 
    //          peseta sign U+20A7
    switch (gLanguage) {
        case "Icelandic":
            gChars[27]="þ"; //ü
            //gChars[28]="ð"; //å
            gChars[28]="å";
            gChars[29]="æ";  //ä
            gChars[30]="ö";   //ö
            break;
        case "Finnish":
            gChars[27]="ü"; //ü
            gChars[28]="å"; //å
            gChars[29]="ä";  //ä
            gChars[30]="ö";   //ö
            break;
        case "Danish":
            gChars[27]="ü"; //ü
            gChars[28]="å"; //å
            gChars[29]="æ";  //ä
            gChars[30]="ø";   //ö
            break;
        case "French":
            gChars[27]="è"; //ü
            gChars[28]="à"; //å
            gChars[29]="é";  //ä
            gChars[30]="ê";   //ö
            break;
        case "German":
            gChars[27]="ü"; //ü
            gChars[28]="å"; //å
            gChars[29]="ä";  //ä
            gChars[30]="ö";   //ö
            break;
        case "Spanish":
            gChars[27]="ú"; //ü
            gChars[28]="á"; //å
            gChars[29]="é";  //ä
            gChars[30]="ó";   //ö
    } // end switch
    // punctuation in common
    gChars[31]=".";
    gChars[32]=",";
    gChars[33]="!";
    gChars[34]="?";
    gChars[35]="-";
    gChars[36]="'";
    gChars[37]="\\";
    gChars[38]="/";

    gChars[39]="and ";
    gChars[40]="with ";
    gChars[41]="to ";

    switch (gLanguage) {
        case "Icelandic":
            // combining diaeresis U+0308 ( ̈  ) - lower right, tab group
            gChars[39]="\u0308 ";
            //gChars[40]="å"; //§ lower left ctrl group
            gChars[40]="ð";
            // combining acute accent U+0301 - upper right, tab group
            gChars[41]="\u0301";
            break;
        case "Finnish":
            // combining diaeresis U+0308 ( ̈  ) - lower right, tab group
            gChars[39]="\u0308";
            gChars[40]="§"; //§ lower left ctrl group
            // combining caron U+030C ( ̌  )- upper right, tab group
            gChars[41]="\u030c";
            break;
        case "French":
            gChars[39]="\u0308";// combining diaeresis
            gChars[40]="ç"; // cedilla lower left ctrl group
            gChars[41]="\u0302"; // combining circumflex U+0302 (̂  )
            gChars[37]="\u0300"; // grave U+0300  acute U+0301
            gChars[38]="\u0301";
            break;
        case "German":
            gChars[39]="\u0308"; // combining diaeresis
            gChars[40]="ß"; //§ lower left ctrl group
            gChars[41]="\u030c"; // combining caron
            break;
        case "Spanish":
            gChars[39]="ñ"; //  lower right, tab group
            gChars[40]="\u00fc"; // ̈  lower left ctrl group
            gChars[41]="í"; // upper right, tab group
    } // end switch
    gChars[42]=""; //up
    gChars[42]=""; //down
    gChars[44]=""; //pgup
    gChars[45]=""; //pgdn
    gChars[46]=""; //bs
    gChars[47]=""; //left
    gChars[48]=""; //wordleft
    gChars[49]=""; //home
    gChars[50]=" "; //space
    gChars[51]=""; //right
    gChars[52]=""; //wordright
    gChars[53]=""; //end
    gChars[54]=""; //enter
    gChars[55]="	"; //tab
    gChars[56]=""; //esc
    gChars[57]=""; //del
    gChars[58]=""; //ins
    gChars[59]=""; //shift
    gChars[60]=""; //symb
    gChars[61]=""; //123abc
    gChars[62]=""; //ctrl
    gChars[63]=""; //alt

    gChars[64]=""; // not used

    //---- Ref + 64 Upper case
    gChars[65]="A";
    gChars[66]="B";
    gChars[67]="C";
    gChars[68]="D";
    gChars[69]="E";
    gChars[70]="F";
    gChars[71]="G";
    gChars[72]="H";
    gChars[73]="I";
    gChars[74]="J";
    gChars[75]="K";
    gChars[76]="L";
    gChars[77]="M";
    gChars[78]="N";
    gChars[79]="O";
    gChars[80]="P";
    gChars[81]="Q";
    gChars[82]="R";
    gChars[83]="S";
    gChars[84]="T";
    gChars[85]="U";
    gChars[86]="V";
    gChars[87]="W";
    gChars[88]="X";
    gChars[89]="Y";
    gChars[90]="Z";

    gChars[91]="Th";
    gChars[92]="That ";
    gChars[93]="The ";
    gChars[94]="Of ";

    // à/À  è/È  ì   ò  ù/Ù  -  á  é/É  í  ó  ú  -  ñ/Ñ - ê/Ê
    // œ/Œ  -  ô/Ô  -  ç/Ç
    // Spanish: ¿ ¡ º(Masculine Ordinal u+00BA) ª(Feminine Ordinal u+00AA)
    //          Á É Í Ó Ú Ñ Ü á é í ó ú ñ ü 
    //          peseta sign U+20A7

    if (gLanguage == "Icelandic"){
    gChars[91]="Þ"; //ü
    //gChars[92]="Ð"; //å
    gChars[92]="Å";
    gChars[93]="Æ";  //ä
    gChars[94]="Ö";   //ö
    }

    if (gLanguage == "Finnish"){
    gChars[91]="Ü"; //ü
    gChars[92]="Å"; //å
    gChars[93]="Ä";  //ä
    gChars[94]="Ö";   //ö
    }


    if (gLanguage == "Danish"){
    gChars[91]="Ü"; //ü
    gChars[92]="Å"; //å
    gChars[93]="Æ";  //ä
    gChars[94]="Ø";   //ö
    }

    if (gLanguage == "French"){
    gChars[91]="È"; //ü
    gChars[92]="À"; //å
    gChars[93]="É";  //ä
    gChars[94]="Ê";   //ö
    }

    if (gLanguage == "German"){
    gChars[91]="Ü"; //ü
    gChars[92]="Å"; //å
    gChars[93]="Ä";  //ä
    gChars[94]="Ö";   //ö
    }

    if (gLanguage == "Spanish"){
    gChars[91]="Ú"; //ü
    gChars[92]="Á"; //å
    gChars[93]="É";  //ä
    gChars[94]="Ó";   //ö
    }


    gChars[95]=":"; // Jan 2010 updated tables: Shift+punctuation = SYMB+punctuation (but not CAPS)
    gChars[96]=";";
    gChars[97]="|";
    gChars[98]="~";
    gChars[99]="_";
    gChars[100]="\"";
    gChars[101]="\u0300"; // combining grave accent U+0300
    gChars[102]="\u0301"; // combining acute accent U+0301

    gChars[103]="And ";
    gChars[104]="With ";
    gChars[105]="To ";


    if (gLanguage == "Icelandic"){
    gChars[103]="\u0308"; // combining diaresis U+0308 ( ̈  ) - lower right, tab group
    //gChars[104]="Å"; //§ lower left ctrl group
    gChars[104]="Ð";
    gChars[105]="\u030c"; // combining caron U+030C ( ̌  )- upper right, tab group
    }


    if (gLanguage == "German" || gLanguage == "Finnish" || gLanguage == "Danish"){
    gChars[103]="\u0308"; // combining diaresis U+0308 ( ̈  ) - lower right, tab group
    gChars[104]="ẞ"; //§ lower left ctrl group
    gChars[105]="\u030c"; // combining caron U+030C ( ̌  )- upper right, tab group
    }
    // à/À  è/È  ì   ò  ù/Ù  -  á  é/É  í/Í  ó  ú  -  ñ/Ñ - ê/Ê
    if (gLanguage == "French"){
    gChars[103]="\u0308"; // combining diaresis U+0308 ( ̈  ) - lower right, tab group
    gChars[104]="Ç"; // cedilla lower left ctrl group
    gChars[105]="\u0302"; // combining circumflex U+0302 (̂  ) - upper right, tab group
    gChars[101]="\\"; // combining grave accent => \
    gChars[102]="/"; // combining acute accent => /
    }

    if (gLanguage == "Spanish"){
    gChars[97]="\u00a1"; //reverse !
    gChars[98]="\u00bf"; //reverse ?

    gChars[103]="Ñ"; //  lower right, tab group
    gChars[104]="\u00dc"; // ̈  lower left ctrl group Ü
    gChars[105]="Í"; // upper right, tab group
    }


    //------etc.

    // Ref + 128 Numbers
    gChars[129]="1";
    gChars[130]="2";
    gChars[131]="3";
    gChars[132]="4";
    gChars[133]="5";
    gChars[134]="6";
    gChars[135]="0";
    gChars[136]="7";
    gChars[137]="8";
    gChars[138]="9";
    gChars[139]="#";
    gChars[140]="@";
    gChars[141]="½";
    gChars[142]="&";
    gChars[143]="+";
    gChars[144]="%";
    gChars[145]="=";
    gChars[146]="^";
    gChars[147]="*";
    gChars[148]="$";
    gChars[149]="€";
    gChars[150]="£";
    gChars[151]="(";
    gChars[152]="[";
    gChars[153]="<";
    gChars[154]="{";
    gChars[155]=")";
    gChars[156]="]";
    gChars[157]=">";
    gChars[158]="}";
    gChars[159]=".";
    gChars[160]=",";
    gChars[161]="!";
    gChars[162]="?";
    gChars[163]="-";
    gChars[164]="'";
    gChars[165]="\\";
    gChars[166]="/";
    gChars[167]="μ";
    gChars[168]="§";
    gChars[169]="";
    //------etc.

    // Ref + 192 SYMB
    gChars[193]="1";
    gChars[194]="2";
    gChars[195]="3";
    gChars[196]="4";
    gChars[197]="5";
    gChars[198]="6";
    gChars[199]="0";
    gChars[200]="7";
    gChars[201]="8";
    gChars[202]="9";
    gChars[203]="#";
    gChars[204]="@";
    gChars[205]="½";
    gChars[206]="&";
    gChars[207]="+";
    gChars[208]="%";
    gChars[209]="=";
    gChars[210]="^";
    gChars[211]="*";
    gChars[212]="$";
    gChars[213]="€";
    gChars[214]="£";
    gChars[215]="(";
    gChars[216]="[";
    gChars[217]="<";
    gChars[218]="{";
    gChars[219]=")";
    gChars[220]="]";
    gChars[221]=">";
    gChars[222]="}";
    gChars[223]=":";
    gChars[224]=";";
    gChars[225]="|";
    gChars[226]="~";
    gChars[227]="_";
    gChars[228]="\"";
    gChars[229]="\u0300"; // combining grave accent U+0300
    gChars[230]="\u0301"; // combining acute accent U+0301

    gChars[231]="μ"; // Lower right, tab group
    gChars[232]="§"; // Lower left, ctrl group
    gChars[233]="̌"; // Upper right, tab group

    gChars[250]="°";  // Upper left, ctrl group (symbed Ins 58+192)

    if (gLanguage == "Finnish" || gLanguage == "Danish"){
    gChars[231]="μ"; // lower right, tab group
    gChars[232]="ß"; //§ lower left ctrl group
    gChars[233]="̂"; // combining circumflex U+0302 ( ̂  ) upper right, tab group
    }

    if (gLanguage == "Icelandic"){
    gChars[231]="μ"; // lower right, tab group
    gChars[232]="§"; //§ lower left ctrl group
    gChars[233]="\u030c"; // combining caron U+030C ( ̌  )- upper right, tab group
    }


    if (gLanguage == "French"){
    gChars[231]="œ"; // lower right, tab group
    gChars[232]="§"; // lower left ctrl group
    gChars[233]="\u030c"; // combining caron U+030C ( ̌  )- upper right, tab group
    gChars[229]="\\"; // combining grave accent U+0300 => \
    gChars[230]="/"; // combining acute accent U+0301 => /
    }


    if (gLanguage == "German"){
    gChars[231]="μ"; // lower right, tab group
    gChars[232]="§"; //§ lower left ctrl group
    gChars[233]="̂"; // combining circumflex U+0302 ( ̂  ) upper right, tab group
    }

    if (gLanguage == "Spanish"){
    gChars[231]="\u0302 "; // comb. circumflex lower right, tab group
    gChars[232]="\u0308 "; // combining diaeresis lower left ctrl group
    gChars[233]="\u00aa"; // upper right, tab group Feminine Ordinal u+00AA
    gChars[250]="\u00ba"; //SYMB ins, upper left ctrl group Masculine Ordinal u+00BA
    }






    //gChars[223]="";
    //....etc. like CAPS and shifted numbers

}

function pickRussianCharacters(){
    gChars[1] = "а";// abc
    gChars[2] = "б";
    gChars[3] = "ц";
    gChars[4] = "д";
    gChars[5] = "е";
    gChars[6] = "ф";
    gChars[7] = "г";// g
    gChars[8] = "х";
    gChars[9] = "и";
    gChars[10] = "й";
    gChars[11] = "к";// k
    gChars[12] = "л";
    gChars[13] = "м";
    gChars[14] = "н";
    gChars[15] = "о";// o
    gChars[16] = "п";
    gChars[17] = "ж";
    gChars[18] = "р";
    gChars[19] = "с";// s
    gChars[20] = "т";
    gChars[21] = "у";
    gChars[22] = "в";
    gChars[23] = "ш";// w
    gChars[24] = "ч";
    gChars[25] = "ы";
    gChars[26] = "з";

    gChars[27] = "щ";
    gChars[28] = "ю";
    gChars[29] = "э";
    gChars[30] = "я";
  
//  gChars[31] = ".";
//  gChars[32] = ",";
//  gChars[33] = "!";
//  gChars[34] = "?";
//  gChars[35] = "-";
//  gChars[36] = "'";
//  gChars[37] = "\\";
//  gChars[38] = "/";
  
    gChars[39] = "ъ";// lower
    gChars[40] = "ь";// § 
    gChars[41] = "̈";// upper

    // -----------------Russian 65...  -----------------  
    gChars[65] = "А";// Upper Case = Lower case + 64
    gChars[66] = "Б";
    gChars[67] = "Ц";
    gChars[68] = "Д";
    gChars[69] = "Е";
    gChars[70] = "Ф";
    gChars[71] = "Г";// G
    gChars[72] = "Х";
    gChars[73] = "И";
    gChars[74] = "Й";
    gChars[75] = "K";// K
    gChars[76] = "Л";
    gChars[77] = "М";
    gChars[78] = "Н";
    gChars[79] = "О";// O
    gChars[80] = "П";
    gChars[81] = "Ж";
    gChars[82] = "Р";
    gChars[83] = "С";// S
    gChars[84] = "Т";
    gChars[85] = "У";
    gChars[86] = "В";
    gChars[87] = "Ш";// W
    gChars[88] = "Ч";
    gChars[89] = "Ы";
    gChars[90] = "З";
    gChars[91] = "Щ";// Ü
    gChars[92] = "Ю";
    gChars[93] = "Э";
    gChars[94] = "Я";
//  gChars[95] = ".";
//  gChars[96] = ",";
//  gChars[97] = "!";
//  gChars[98] = "?";
//  gChars[99] = "-";
//  gChars[100] = "'";
//  gChars[101] = "\\";
//  gChars[102] = "/";
    gChars[103] = "Ъ";//lower
    gChars[104] = "Ь";
    gChars[105] = "̈"; //upper
}

function pickGreekCharacters(){
//----------------Greek 1-41 (part of 1-64) ----------------------
  gChars[1] = "α"; //abc
  gChars[2] = "ο";
  gChars[3] = "ς";
  gChars[4] = "δ";
  gChars[5] = "ε";
  gChars[6] = "φ";
  gChars[7] = "γ"; //g
  gChars[8] = "χ";
  gChars[9] = "η";
  gChars[10] = "ι";
  gChars[11] = "κ"; //k
  gChars[12] = "λ";
  gChars[13] = "μ";
  gChars[14] = "ν";
  gChars[15] = "ω"; //o
  gChars[16] = "π";
  gChars[17] = "ψ";
  gChars[18] = "ρ";
  gChars[19] = "σ"; //s
  gChars[20] = "τ";
  gChars[21] = "ου";
  gChars[22] = "β";
  gChars[23] = "́"; //w
  gChars[24] = "ξ";
  gChars[25] = "υ";
  gChars[26] = "ζ";

    gChars[27] = "θ";
    gChars[28] = "";
    gChars[29] = "ει";
    gChars[30] = "";
  
// gChars[31] = ".";
// gChars[32] = ",";
// gChars[33] = "!";
// gChars[34] = "?";
// gChars[35] = "-";
// gChars[36] = "'";
// gChars[37] = "\\";
// gChars[38] = "/";
  
  gChars[39] = "̈"; //lower
  gChars[40] = "§"; //§ 
  gChars[41] = "̂"; //upper

//-----------------Greek 64... -----------------  
  gChars[65] = "Α"; //Upper Case = Lower case + 64
  gChars[66] = "Ο";
  gChars[67] = "ς";
  gChars[68] = "Δ";
  gChars[69] = "Ε";
  gChars[70] = "Φ";
  gChars[71] = "Γ"; //G
  gChars[72] = "Χ";
  gChars[73] = "Η";
  gChars[74] = "Ι";
  gChars[75] = "Κ"; //K
  gChars[76] = "Λ";
  gChars[77] = "Μ";
  gChars[78] = "Ν";
  gChars[79] = "Ω"; //O
  gChars[80] = "Π";
  gChars[81] = "Ψ";
  gChars[82] = "Ρ";
  gChars[83] = "Σ"; //S
  gChars[84] = "Τ";
  gChars[85] = "Ου";
  gChars[86] = "Β";
  gChars[87] = "́"; //W";
  gChars[88] = "Ξ";
  gChars[89] = "Υ";
  gChars[90] = "Ζ";

  gChars[91] = "Θ"; //Ü
  gChars[92] = ""; 
  gChars[93] = "Ει";
  gChars[94] = ""; 

// gChars[95] = ".";
// gChars[96] = ",";
// gChars[97] = "!";
// gChars[98] = "?";
// gChars[99] = "-";
// gChars[100] = "'";
// gChars[101] = "\\";
// gChars[102] = "/";
  
  gChars[103] = "̈"; //lower
  gChars[104] = "§";
  gChars[105] = "̂";  //upper

}

//===================================
onload = function(){

 pickLatinCharacters();

 chord = 0;
 //field = document.getElementById('text_field')
 field2 = document.getElementById('text_field2');
 info2 = document.getElementById('info_field2');
 field2.onkeydown = keyhitDown;
 field2.onkeyup = keyhitUp;
 field2.focus();

 //info2.value = gLanguage;
 usedLanguage(); // update to ticked laguage

 stopCount(); // reset counter display

};
//==========================
function doGetCaretPosition (field2) {
	var CaretPos = 0;	// IE Support
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
function updatechord(key, go_up, go_down){

}
//--------------------------
function checkShifts(){
	if(shiftOn){shiftOn = false; info2.value = gLanguage;}
	if(symbOn){symbOn = false; info2.value = gLanguage;}
	if(altOn){altOn = false; info2.value = gLanguage;}
	if(ctrlOn){ctrlOn = false; info2.value = gLanguage;}

}
//---------------------------
function getvalue(key){
	//chord = 3
	return; // chord
}
// --------------------------
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
	return NULL;
		}
	else {

	gLanguage = chosen; // Current language
	basicLanguage = chosen; // Ticked language
	pickLatinCharacters(); // always this (punctuation, 123 etc. is icluded here for other languages as well)

	if (basicLanguage == "Korean"){
	pickKoreanCharacters();
	gJamoCounter = 0;
	}

	if (basicLanguage == "Russian"){
	pickRussianCharacters();
	}

	if (basicLanguage == "Greek"){
	pickGreekCharacters();
	}

	
		}

	//Update the layout picture
	// src="../korean2.jpg" id="decal">

	if (basicLanguage == "English"){document.getElementById('decal').src='../english2.png';}
	if (basicLanguage == "Finnish"){document.getElementById('decal').src='../finnish2.png';}
	if (basicLanguage == "French"){document.getElementById('decal').src='../french2.png';}
	if (basicLanguage == "German"){document.getElementById('decal').src='../german2.png';}
	if (basicLanguage == "Greek"){document.getElementById('decal').src='../greek2.png';}
	if (basicLanguage == "Icelandic"){document.getElementById('decal').src='../icelandic2.png';}
	if (basicLanguage == "Korean"){document.getElementById('decal').src='../hangeul_roman.png';}
	if (basicLanguage == "Danish"){document.getElementById('decal').src='../danish2.png';}
	//if (basicLanguage == "Korean"){document.getElementById('decal').src='../korean2.png'}
	if (basicLanguage == "Russian"){document.getElementById('decal').src='../russian2.png';}
	if (basicLanguage == "Sanskrit"){document.getElementById('decal').src='../sanskrit2.png';}
	if (basicLanguage == "Spanish"){document.getElementById('decal').src='../spanish2.png';}



   info2.value = gLanguage;
   field2.focus(); 

}

 


//--------------------
function keyhitDown(e){

  thisKey = e ? e.which : window.event.keyCode;
  //thisKey = e ? e.which : document.event.keyCode

  	prevChord = chord;
	cCounter = c; // store timer value before clearing it

	if(chordx == 0){chord1 = 0; chord2 = 0;} // starting a whole new combo or chordon
  	//doTimer(); // Reset Timer for each key down event  
	

  switch (thisKey) {
        //chord = 0
        // NOTE: SDF=CBA and JKL=DEF: First set of 3 is INTENTIONALLY REVERSED
	case 70: if(gAdown == false){chord = chord + 1; chordx = chordx + 1; doTimer();} // chordx = realtime value
		gAdown = true; // to kill autorepeat
		break;
	case 68: if(gBdown == false){chord = chord + 2; chordx = chordx + 2; doTimer();}
		gBdown = true;
		break;
	case 83: if(gCdown == false){chord = chord + 4; chordx = chordx + 4; doTimer();}
		gCdown = true;
		break;
	case 74: if(gDdown == false){chord = chord + 8; chordx = chordx + 8; doTimer();}
		gDdown = true;
		break;
	case 75: if(gEdown == false){chord = chord + 16; chordx = chordx + 16; doTimer();}
		gEdown = true;
		break;
	case 76: if(gFdown == false){chord = chord + 32; chordx = chordx + 32; doTimer();}
		gFdown = true;
		break;
	default: chord = chord;

   }
	//info2.value = chordx; // debug

// ===========Vowel detection (for Sanskrit only)============
  if (cCounter >= 10) // <== The exact delay required  can be adjusted here
	  // This is the 10 ms timer count to separate vowels and consonants 
	  // (e.g. a Typical value c = 8 gives 8 x 10 ms = 80 ms)
  {
         // Vowels have been detected due to delay. Study them further:

	chord1 = prevChord; // chord1 and chord2 in case of a Chordon

   if (gLanguage == "Sanskrit"){	
	switch (prevChord) 
	{
	case  8: chord = chord + 128; 	break; //  8      or J
	case 16: chord = chord + 128; 	break; // 16      or K
	case 32: chord = chord + 128; 	break; // 32      or L
	case 24: chord = chord + 128; 	break; // 8+16    or JK-
	case 40: chord = chord + 128; 	break; // 8+32    or J-L
	case 48: chord = chord + 128; 	break; // 16+32   or -KL
	case 56: chord = chord + 128; 	break; // 8+16+32 or JKL
                                       // The rest are left-hand-first chords:
        default: chord = chord + 64;    // add 64, vowel detected by timer (3 + 3 keys used), left hand first
	}                              // end of switch
     } // end of if
  }      

	return false; //true;  // Cancel the original keyhit event
}

//---------------------------
function keyhitUp(e)
{

  thisKey = e ? e.code : window.event.code;

  cCounterx = c; // store timer value before clearing it

  prevChordx = chordx;

  switch (thisKey) {
  case "KeyF": key = 'A'; // qwertyui
   	getvalue(key);
	chordx = chordx - 1; gAdown = false;
   	break;
  case "KeyD": key = 'B';
   	getvalue(key);
	chordx = chordx - 2; gBdown = false;
   	break;
  case "KeyS": key = 'C';
   	getvalue(key);
	chordx = chordx - 4; gCdown = false;
   	break;

  case "KeyJ": key = 'D';
   	getvalue(key);
	chordx = chordx - 8; gDdown = false;
   	break;
  case "KeyK": key = 'E';
   	getvalue(key);
	chordx = chordx - 16; gEdown = false;
   	break;
  case "KeyL": key = 'F';
   	getvalue(key);
	chordx = chordx - 32; gFdown = false;
   	break;
  default: key = null;
  }

	if (chordx <= 0){chordx = 0;} // just to make sure
	chord2 = 0; // default
	if (cCounterx >= 15){chord2 = prevChordx;} // a second chord after a delayed relase (set dealay here 10...20)

	//chord2 = 3; // TEST

  	doTimer(); // Reset Timer for each key up event too  
  	if(chordx == 0){stopCount();} // Stop and reset timer when all keys are released
	//info2.value = chordx; // debug


  // only if SDF/JKL pressed & released:

  	if(key){
		// due to delayed press
//		if(chord1 >= 0){
//			chord = chord1;
//			outputChar();
//			}
		// second character due to delayed release of keys:
		if((chord2 >= 0) && (chord == 0)){ // chord = 0 means first one was sent
			chord = chord2;
			outputChar();
			}
	outputChar(); // original character
	}

	field2.scrollTop = field2.scrollHeight;  // keep bottom line visible
	return true;
}

//-------------------------
function outputChar(){
   field = document.getElementById('text_field2');

   if (gLanguage == "Sanskrit" && numbOn == false){
	goSanskrit();
	field2.scrollTop = field2.scrollHeight;  // keep bottom line visible
	return true;
	}


   cursonPosAdd = 1; //default entry length
   gOffset = 0; // default

	if(shiftOn){gOffset = 64;}
	if(numbOn){gOffset = 128;}
	if(symbOn){gOffset = 192;}

	if(gLanguage == "Korean"){ //  use a tail consonant?
		if(gJamoCounter == 2){gOffset = 64;} // yes
	}

	gRef = 0; // Default (only values 1 to 41 are updated below)
switch (chord){
	case 1: character =  gChars[1+gOffset]; //gchar[1,1,1,1]
	gRef = 1; break;
	case 2: character =  gChars[2+gOffset];
	gRef = 2; break;
	case 4: character =  gChars[3+gOffset];
	gRef = 3; break;
	case 8: character =  gChars[4+gOffset];
	gRef = 4; break;
	case 16: character = gChars[5+gOffset];
	gRef = 5; break;
	case 32: character = gChars[6+gOffset];
	gRef = 6; break;
	case 24: character = gChars[7+gOffset];
	gRef = 7; break;
	case 25: character = gChars[8+gOffset];
	gRef = 8; break;
	case 26: character = gChars[9+gOffset];
	gRef = 9; break;
	case 28: character = gChars[10+gOffset];
	gRef = 10; break;
	case 48: character = gChars[11+gOffset];
	gRef = 11; break;
	case 49: character = gChars[12+gOffset];
	gRef = 12; break;
	case 50: character = gChars[13+gOffset];
	gRef = 13; break;
	case 52: character = gChars[14+gOffset];
	gRef = 14; break;
	case 3: character =  gChars[15+gOffset];
	gRef = 15; break;
	case 11: character =  gChars[16+gOffset];
	gRef = 16; break;
	case 19: character =  gChars[17+gOffset];
	gRef = 17; break;
	case 35: character =  gChars[18+gOffset];
	gRef = 18; break;
	case 6: character =  gChars[19+gOffset];
	gRef = 19; break;
	case 14: character =  gChars[20+gOffset];
	gRef = 20; break;
	case 22: character =  gChars[21+gOffset];
	gRef = 21; break;
	case 38: character =  gChars[22+gOffset];
	gRef = 22; break;
	case 40: character = gChars[23+gOffset]; // W
		gJamoCounter = 2; //0; // This is Next Syllable key as well
	gRef = 23; break;
	case 41: character = gChars[24+gOffset];
	gRef = 24; break;
	case 42: character = gChars[25+gOffset];
	gRef = 25; break;
	case 44: character = gChars[26+gOffset];
	gRef = 26; break;
	// native range 1 (3 keys down)
	case 5: character =  gChars[27+gOffset];  // umlaut or TH
	gRef = 27; break;
	case 13: character = gChars[28+gOffset]; // Å or THAT_
	gRef = 28; break;
	case 21: character = gChars[29+gOffset];  // Ä or THE_
	gRef = 29; break;
	case 37: character = gChars[30+gOffset];  // Ö or OF_
	gRef = 30; break;	// ----
	case 34: character = gChars[31+gOffset];
	gRef = 31; break;
	case 20: character = gChars[32+gOffset];
	gRef = 32; break;
	case 12: character = gChars[33+gOffset];
	gRef = 33; break;
	case 33: character = gChars[34+gOffset];
	gRef = 34; break;
	case 17: character = gChars[35+gOffset];
	gRef = 35; break;
	case 10: character = gChars[36+gOffset];
	gRef = 36; break;
	case 51: character = gChars[37+gOffset];
	gRef = 37; break;
	case 30: character = gChars[38+gOffset];
	gRef = 38; break;
	// Native range 2 (4 keys down):
	case 53: character = gChars[39+gOffset]; // low right
	gRef = 39; break;
	case 46: character = gChars[40+gOffset]; // low left
	gRef = 40; break;
	case 29: character = gChars[41+gOffset]; // upper right
	gRef = 41; break;
	case 43: character = gChars[58+gOffset]; // Ins (char for SYMB only)
	break;
	// ----


	case 56: character = " "; // Space
		gJamoCounter = 2; // means counter will turn to zero
	break;

	case 7: // backspace 
	   	myString = myString.substring(0, myString.length-1);
           	field2.value = myString;
		gDecJamoCounter(); 
		chord = 0; // this is to return without adding any char
	break;

	case 63: character = '';  // abc123		
		if(numbOn){numbOn = false; info2.value = gLanguage; gJamoCounter = 0;}
		else{numbOn = true;
			if(altOn){
				if(gLanguage !== basicLanguage){
				gLanguage = basicLanguage;
				pickLatinCharacters(); info2.value = gLanguage;
				altOn = false; numbOn = false;}
				
				else{
				gLanguage = "English";
				pickLatinCharacters(); info2.value = gLanguage;
				altOn = false; numbOn = false;}
			}
		} // end of else	
		chord = 0;		
		gJamoCounter = 2; // means counter will turn to zero
	break;

	case 18: character = '';  // Shift
		if(shiftOn){shiftOn = false;}
		else{shiftOn = true; info2.value = "Shift";} 
		chord = 0;		
	break;

	case 45: character = '';  // Symb		
		if(symbOn){symbOn = false;}
		else{symbOn = true; info2.value = "SYMB";} 
		chord = 0;		
	break;

	case 55: character = 'Alt';  // 		
		if(altOn){altOn = false;}
		else{altOn = true; info2.value = "Alt";} 
		chord = 0;		
	break;

	case 47: character = 'Ctrl';  // 		
		if(ctrlOn){ctrlOn = false;}
		else{ctrlOn = true; info2.value = "Ctrl";} 
		chord = 0;		
	break;


	case 29: character = 'TO ';
	break;

	case 53: character = 'AND ';
	break;

	case 59: character = String.fromCharCode(13).toLowerCase(); //Enter
	break;

	case 15: // Left Arrow
		cursorPos = doGetCaretPosition (field2) - 1;
		setCaretPosition(field2, cursorPos);
		chord = 0; // this is to return without adding any char
	break;
	case 57: // Right Arrow
		cursorPos = doGetCaretPosition (field2) + 1;
		setCaretPosition(field2, cursorPos);
		chord = 0; // this is to return without adding any char
	break;
	case 39: // Home
		cursorPos = 0;
		setCaretPosition(field2, cursorPos);
		chord = 0; // this is to return without adding any char
	break;
	case 60: // End
		cursorPos = myString.length;
		setCaretPosition(field2, cursorPos);
		chord = 0; // this is to return without adding any char
	break;
	

	default: character = '-';
   	}

	cursorPosAdd = character.length;

	cursorPos = doGetCaretPosition (field2); // always get cursor position first
	if (chord != 0){
           //myString = myString + character
		myString = myString.substring(0, cursorPos) + character + myString.substring(cursorPos, myString.length);
                field2.value = myString;
		setCaretPosition(field2, cursorPos + cursorPosAdd);

		if (gLanguage == "Korean"){gIncJamoCounter();}
		checkShifts();
		}
	chord = 0;

}

//------------------------

function goSanskrit(){

   field = document.getElementById('text_field2');

   cursonPosAdd = 1; //default entry length
   gOffset = 0; // default

 switch (chord)
	{                        //  04.02.01-08.16.32  
// ==================================================================
//vowels, maatraas, others

	case  73: character = '्';	break; //a   64 gets added
	case  81: character = 'ा';	break; //aa  64 gets added
	case 137: character = 'अ';	break; //a  128 gets added
	case 145: character = 'आ';	break; //aa 128 gets added

	case   89: character = 'ऽ';	break; //.
	case  113: character = 'ः';	break; //..
	case 153: character = '।';	break; //
	case 177: character = '॥';	break; //

	case  74: character = 'ि';	break; //ii
	case  82: character = 'ी';	break; //i
	case 138: character = 'इ';	break; //
	case 146: character = 'ई';	break; //

	case  90: character = 'ॢ';	break; //lri
	case 114: character = 'ॣ';	break; //lrii
	case 154: character = 'ऌ';	break; //
	case 178: character = 'ॡ';	break; //


	case  76: character = 'ु';	break; //
	case  84: character = 'ू';	break; //
	case 140: character = 'उ';	break; //
	case 148: character = 'ऊ';	break; //

	case  92: character = 'ं';	break; //om
	case 116: character = '़';	break; //ung
	case 156: character = 'ॐ';	break; // ok  8+16+4 +128 or JK -> JLS
	case 180: character = 'ँ';	break; // ok	16+32+4 +128

	case  75: character = 'े';	break; //
	case  83: character = 'ै';	break; //
	case 139: character = 'ए';	break; //
	case 147: character = 'ऐ';	break; //

	case  91: character = 'ॅ';	break; //e
	case 115: character = 'ॆ';	break; //ee
	case 155: character = 'ऍ';	break; //e
	case 179: character = 'ऎ';	break; //ee

	case  78: character = 'ो';	break; // 
	case  86: character = 'ौ';	break; //
	case 142: character = 'ओ';	break; //
	case 150: character = 'औ';	break; //

	case  94: character = 'ॉ';	break; //2 4 8  16 64 
	case 118: character = 'ॊ';	break; //2 4 16 32 64 
	case 158: character = 'ऑ';	break; //2 4 8  16 128
	case 182: character = 'ऒ';	break; //

	case  77: character = 'ृ';	break; //
	case  85: character = 'ॄ';	break; //
	case 141: character = 'ऋ';	break; //
	case 149: character = 'ॠ';	break; //

	case 157: character = 'zwj';	break; // ok 1 4 8+16 +128 or JKL -> JKLS

	case 181: character = 'zwnj';	break; // ok 1 4 16+32 +128 or JKL -> JKLS





	case 161: character = 'LF';	break; // 32+1 +128
	case 162: character = 'LD';	break; // 32+2 +128
	case 164: character = 'LS';	break; // 32+4 +128

	case 169: character = 'JLF';	break; //
	case 170: character = 'JLD';	break; // ok  8+32+2 +128 or JL -> JLD
	case 172: character = 'JLS';	break; // ok  8+32+4 +128 or JL -> JLD

	case 185: character = 'JKLF';	break; // ok 8+16+32+1 +128 or JKL -> JKLF
	case 186: character = 'JKLD';	break; // ok 8+16+32+2 +128 or JKL -> JKLD

	case 188: character = 'JKLS';	break; // ok 8+16+32+4 +128 or JKL -> JKLS






//====================================
//consonants :

	//case  1: character = "\u1100" ;	break // gchar[1,1,1,1]  
	case  1: character = 'क' ;	break; // gchar[1,1,1,1]  
	case  9: character = 'ख' ;	break; // 
	case 17: character = 'ग';	break;  //
	case 33: character = 'घ' ;	break; //
	case 57: character = 'ङ' ;	break; //
                                  
	case 25: character = 'क़' ;	break; //
	case 49: character = 'ख़' ;	break; //
	case 41: character = 'ग़' ;	break; //   

	case  2: character = 'च' ;	break; //
	case 10: character = 'छ' ;	break; //
	case 18: character = 'ज' ;	break; //
	case 34: character = 'झ' ;	break; //
	case 58: character = 'ञ' ;	break; //

	case 26: character = 'ज़' ;	break; //
	case  4: character = 'ट' ;	break; //
	case 12: character = 'ठ' ;	break; //
	case 20: character = 'ड' ;	break; //
	case 36: character = 'ढ' ;	break; //
	case 60: character = 'ण' ;	break; //

	case 28: character = 'ड़' ;	break; //   
	case 52: character = 'ढ़' ;	break; //   

	case  3: character = 'त' ;	break; //
	case 11: character = 'थ' ;	break; //
	case 19: character = 'द' ;	break; //
	case 35: character = 'ध' ;	break; //
	case 59: character = 'न' ;	break; //
	case 27: character = 'ऩ' ;	break; //
	break;

	case  6: character = 'प' ;	break; //
	case 14: character = 'फ' ;	break; //
	case 22: character = 'ब' ;	break; //
	case 38: character = 'भ' ;	break; //
	case 62: character = 'म' ;	break; //

	case 30: character = 'फ़' ;	break; //

	case  7: character = 'य' ;	break; //
	case 15: character = 'र' ;	break; //
	case 23: character = 'ल' ;	break; //
	case 39: character = 'व' ;	break; //
                                                
	case 31: character = 'य़' ;	break; //
	case 55: character = 'ऱ' ;	break; //
	case 47: character = 'ळ' ;	break; //
	case 46: character = 'ऴ' ;	break; // Changed from 63 (=abc123 from now on) to 46
                                     
	case  5: character = 'श' ;	break; //
	case 13: character = 'ष' ;	break; //
	case 21: character = 'स' ;	break; //
	case 37: character = 'ह' ;	break; //

	case 29: character = 'क्ष' ;	break; //
	case 53: character = 'त्र' ;	break; //
	case 45: character = 'ज्ञ' ;	break; //

	case  8: character = '	' ;	break; //tab
	case 32: myString = myString.substring(0, myString.length-1); character = '' ;break; // new line

                                   
	case 16: character = " "; break; // space 
	case 56: character = String.fromCharCode(13); break; // .toLowerCase(); //Enter also '\n' '\r'

	// TODO:
	case 63: character = "123"; numbOn = true;  info2.value = "123"; chord = 0 ;
        break;  // enter standard numbers mode

	case 61: character = "abc"; gLanguage = "English";  info2.value = gLanguage; chord = 0;
        break; // enter English mode 
                                      
	default: character = '';
   	}
                                     
	cursorPosAdd = character.length;

	cursorPos = doGetCaretPosition (field2); // always get cursor position first
	if (chord != 0){
   		//myString = myString + character
		myString = myString.substring(0, cursorPos) + character + myString.substring(cursorPos, myString.length);
                field2.value = myString;
		setCaretPosition(field2, cursorPos + cursorPosAdd);
		//checkShifts()
		}
	chord = 0;
}
// vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
