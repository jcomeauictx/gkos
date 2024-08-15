#ifndef GKOS_PRIVATE_H
#define GKOS_PRIVATE_H

#define GKOS_SYMB  0x01
#define GKOS_SHIFT 0x02
#define GKOS_CTRL  0x04
#define GKOS_ALT   0x08
#define GKOS_CAPS  0x10
#define GKOS_META  0x20

#define GKOS_FN (GKOS_SYMB | GKOS_CTRL)
#define GKOS_SYMB_SHIFT (GKOS_SYMB | GKOS_SHIFT)

typedef enum GKOS_MODE_t {
    GKOS_ABC   = 0,
    GKOS_123   = 3,
    GKOS_POINT = 6 // Pointer mode
} GKOS_MODE;


struct GKOS_STATE_t {
    GKOS_MODE mode;
    GKOS_MODE last_mode;
    char      mod;
    char      key_last;
    char      key_acc;
};
typedef struct GKOS_STATE_t GKOS_STATE;
// Max keycode value with 6 bits
#define GKOS_MAX_KEY (A | B | C | D | E | F)

/* 
 * Toggle shift. Combinations for which the state of SHIFT should be toggled before sending keys.
 * For +SHIFT modes, this means that shift will be turned OFF, rather than being left on.
 * EACH LIST MUST BE ZERO TERMINATED!
 */
const char GKOS_ABC_TS[] = {0x0c, 0x1d, 0x21, 0x2e, 0};
const char GKOS_ABC_SYMB_TS[] = {
    0x03, 0x05, 0x06, 0x0a, 0x0b, 0x0c, 0x11, 0x15, 0x16, 0x21, 0x22, 0x23,
    0x25, 0x26, 0x28, 0x2a, 0x2c, 0x30, 0x31, 0x32, 0x34, 0x35, 0
};
const char GKOS_ABC_SHIFT_TS[] = {0x1e, 0x33, 0};
const char GKOS_123_TS[] = {
    0x03, 0x05, 0x06, 0x0b, 0x0c, 0x0e, 0x16, 0x23, 0x25, 0x26, 0x28, 0x2a,
    0x2c, 0x30, 0x31, 0x32, 0x34, 0
};
const char GKOS_123_SYMB_TS[] = {0x0a, 0x0c, 0x11, 0x21, 0x22, 0x35, 0};
const char GKOS_123_SHIFT_TS[] = {0x11, 0x1e, 0x23, 0x33, 0};
const char GKOS_FN_TS[] = {0};
const char *GKOS_TS[] = {
    /* ABC */       GKOS_ABC_TS,
    /* ABC+SYMB */  GKOS_ABC_SYMB_TS,
    /* ABC+SHIFT */ GKOS_ABC_SHIFT_TS,
    /* 123 */       GKOS_123_TS,
    /* 123+SYMB */  GKOS_123_SYMB_TS,
    /* 123+SHIFT */ GKOS_123_SHIFT_TS,
    /* FN */        GKOS_FN_TS
};

// TODO: For international characters, use KEY_COMPOSE and the appropriate keys to type symbols
// TODO: For word left and word right, apply CTRL before left or right key

// Some aliases to make the table below a bit more reasonable
#define K_EQ KEY_EQUAL
#define K_BS KEY_BACKSPACE
#define K_APOS KEY_APOSTROPHE
#define K_LB KEY_LEFTBRACE
#define K_RB KEY_RIGHTBRACE
#define K_SHIFT KEY_LEFTSHIFT
#define K_SEMI KEY_SEMICOLON
#define K_BSL KEY_BACKSLASH
#define K_CTRL KEY_LEFTCTRL
#define K_ALT KEY_LEFTALT
#define K_INS KEY_INSERT
#define K_PGUP KEY_PAGEUP
#define K_PGDN KEY_PAGEDOWN

// Index with [keycode-1][mode+(shift or symb)] only one of SHIFT or SYMB should be on at a time
const uint16_t GKOS_KEY[GKOS_MAX_KEY][7] = {
    /*keycode  ABC,       ABC+SYMB,  ABC+SHIFT, 123,       123+SYMB,  123+SHIFT,  FN  */
    /*  1 */ { KEY_A,     KEY_1,     KEY_A,     KEY_1,     KEY_A,     KEY_1,      KEY_F1 },
    /*  2 */ { KEY_B,     KEY_2,     KEY_B,     KEY_2,     KEY_B,     KEY_2,      KEY_F2 },
    /*  3 */ { KEY_O,     K_EQ,      KEY_O,     K_EQ,      KEY_O,     K_EQ,       KEY_F20 },
    /*  4 */ { KEY_C,     KEY_3,     KEY_C,     KEY_3,     KEY_C,     KEY_3,      KEY_F3 },
    /*  5 */ { 0,         KEY_0,     0,         KEY_0,     0,         KEY_0,      KEY_BREAK},// "th" - Ü
    /*  6 */ { KEY_S,     KEY_8,     KEY_S,     KEY_8,     KEY_S,     KEY_8,      KEY_F20 },
    /*  7 */ { K_BS,      K_BS,      K_BS,      K_BS,      K_BS,      K_BS,       K_BS },
    /*  8 */ { KEY_D,     KEY_4,     KEY_D,     KEY_4,     KEY_D,     KEY_4,      KEY_F4 },
    /*  9 */ { KEY_UP,    KEY_UP,    KEY_UP,    KEY_UP,    KEY_UP,    KEY_UP,     KEY_UP },
    /* 10 */ { K_APOS,    K_APOS,    K_APOS,    K_APOS,    K_APOS,    K_APOS,     K_APOS },
    /* 11 */ { KEY_P,     KEY_5,     KEY_P,     KEY_5,     KEY_P,     KEY_5,      KEY_F14 },
    /* 12 */ { KEY_1,     K_BSL,     KEY_1,     KEY_1,     K_BSL,     KEY_1,      KEY_1 }, // ! (shift 1)
    /* 13 */ { 0,         K_RB,      0,         K_RB,      0,         K_RB,       KEY_PAUSE },// Å - 'that '
    /* 14 */ { KEY_T,     KEY_EURO,  KEY_T,     KEY_4,     KEY_T,     KEY_EURO,   KEY_F17 },
    /* 15 */ { KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,   KEY_LEFT },
    /* 16 */ { KEY_E,     KEY_5,     KEY_E,     KEY_5,     KEY_E,     KEY_5,      KEY_F5 },
    /* 17 */ { KEY_MINUS, KEY_MINUS, KEY_MINUS, KEY_MINUS, KEY_MINUS, KEY_MINUS,  KEY_MINUS },
    /* 18 */ { K_SHIFT,   K_SHIFT,   K_SHIFT,   K_SHIFT,   K_SHIFT,   K_SHIFT,    K_SHIFT },
    /* 19 */ { KEY_Q,     K_EQ,      KEY_Q,     K_EQ,      KEY_Q,     K_EQ,       KEY_F15 },
    /* 20 */ { KEY_COMMA, K_SEMI,    KEY_COMMA, KEY_COMMA, K_SEMI,    KEY_COMMA,  KEY_COMMA },
    /* 21 */ { 0,         KEY_DOT,   0,         KEY_DOT,   0,         KEY_DOT,    KEY_SYSRQ},// Ä OR 'the '
    /* 22 */ { KEY_U,     KEY_4,     KEY_U,     KEY_EURO,  KEY_U,     KEY_4,      KEY_F18},
    /* 23 */ { KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,  KEY_LEFT,   KEY_LEFT },
    /* 24 */ { KEY_G,     KEY_0,     KEY_G,     KEY_0,     KEY_G,     KEY_0,      KEY_F10 },
    /* 25 */ { KEY_H,     KEY_7,     KEY_H,     KEY_7,     KEY_H,     KEY_7,      KEY_F7 },
    /* 26 */ { KEY_I,     KEY_8,     KEY_I,     KEY_8,     KEY_I,     KEY_8,      KEY_F8 },
    /* 27 */ { K_PGUP,    K_PGUP,    K_PGUP,    K_PGUP,    K_PGUP,    K_PGUP,     K_PGUP },
    /* 28 */ { KEY_J,     KEY_9,     KEY_J,     KEY_9,     KEY_J,     KEY_9,      KEY_F9 },
    /* 29 */ { 0,         0,         0,         0,         0,         0,          0 }, // ^ - "to " <¤> 
    /* 30 */ { KEY_SLASH, K_APOS,    KEY_SLASH, KEY_SLASH, K_APOS,    KEY_SLASH,  KEY_SLASH },
    /* 31 */ { KEY_ESC,   KEY_ESC,   KEY_ESC,   KEY_ESC,   KEY_ESC,   KEY_ESC,    KEY_ESC },
    /* 32 */ { KEY_F,     KEY_6,     KEY_F,     KEY_6,     KEY_F,     KEY_6,      KEY_F6 },
    /* 33 */ { KEY_SLASH, KEY_GRAVE, KEY_SLASH, KEY_SLASH, KEY_GRAVE, KEY_SLASH,  KEY_SLASH },//? <¿>
    /* 34 */ { KEY_DOT,   K_SEMI,    KEY_DOT,   KEY_DOT,   K_SEMI,    KEY_DOT,    KEY_DOT },
    /* 35 */ { KEY_R,     KEY_6,     KEY_R,     KEY_6,     KEY_R,     KEY_YEN,    KEY_F16 },
    /* 36 */ { KEY_DOWN,  KEY_DOWN,  KEY_DOWN,  KEY_DOWN,  KEY_DOWN,  KEY_DOWN,   KEY_DOWN },
    /* 37 */ { 0,         K_RB,      0,         K_RB,      0,         K_RB,       KEY_CLEAR},//Ö OR 'of '
    /* 38 */ { KEY_V,     KEY_4,     KEY_V,     KEY_4,     KEY_V,     KEY_4,      KEY_F19 },
    /* 39 */ { KEY_HOME,  KEY_HOME,  KEY_HOME,  KEY_HOME,  KEY_HOME,  KEY_HOME,   KEY_HOME },
    /* 40 */ { KEY_W,     KEY_9,     KEY_W,     KEY_9,     KEY_W,     KEY_9,      KEY_HELP },
    /* 41 */ { KEY_X,     K_LB,      KEY_X,     K_LB,      KEY_X,     K_LB,       KEY_NUMLOCK },
    /* 42 */ { KEY_Y,     KEY_COMMA, KEY_Y,     KEY_COMMA, KEY_Y,     KEY_COMMA,  KEY_SCROLLLOCK },
    /* 43 */ { K_INS,     K_INS,     K_INS,     K_INS,     K_INS,     K_INS,      K_INS },
    /* 44 */ { KEY_Z,     K_LB,      KEY_Z,     K_LB,      KEY_Z,     K_LB,       KEY_SYSRQ },
    /* 45 */ { 0,         0,         0,         0,         0,         0,          0 },//SYMB
    /* 46 */ { KEY_GRAVE, 0,         0,         0,         0,         KEY_GRAVE,  KEY_GRAVE },// ~ § ¤
    /* 47 */ { K_CTRL,    K_CTRL,    K_CTRL,    K_CTRL,    K_CTRL,    K_CTRL,     K_CTRL },
    /* 48 */ { KEY_K,     KEY_3,     KEY_K,     KEY_3,     KEY_K,     KEY_3,      KEY_F10 },
    /* 49 */ { KEY_L,     KEY_2,     KEY_L,     KEY_2,     KEY_L,     KEY_2,      KEY_F11 },
    /* 50 */ { KEY_M,     KEY_7,     KEY_M,     KEY_7,     KEY_M,     KEY_7,      KEY_F12 },
    /* 51 */ { K_BSL,     KEY_GRAVE, K_BSL,     K_BSL,     KEY_GRAVE, K_BSL,      K_BSL },
    /* 52 */ { KEY_N,     KEY_2,     KEY_N,     KEY_7,     KEY_N,     KEY_2,      KEY_F13 },
    /* 53 */ { 0,         KEY_SLASH, 0,         0,         KEY_SLASH, 0,          0}, // ¨ OR 'and '
    /* 54 */ { K_PGDN,    K_PGDN,    K_PGDN,    K_PGDN,    K_PGDN,    K_PGDN,     K_PGDN },
    /* 55 */ { K_ALT,     K_ALT,     K_ALT,     K_ALT,     K_ALT,     K_ALT,      K_ALT },
    /* 56 */ { KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE, KEY_SPACE },
    /* 57 */ { KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT },
    /* 58 */ { KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT, KEY_RIGHT },// Word Right
    /* 59 */ { KEY_ENTER, KEY_ENTER, KEY_ENTER, KEY_ENTER, KEY_ENTER, KEY_ENTER, KEY_ENTER },
    /* 60 */ { KEY_END,   KEY_END,   KEY_END,   KEY_END,   KEY_END,   KEY_END,   KEY_END },
    /* 61 */ { KEY_TAB,   KEY_TAB,   KEY_TAB,   KEY_TAB,   KEY_TAB,   KEY_TAB,   KEY_TAB },
    /* 62 */ { KEY_DELETE,KEY_DELETE,KEY_DELETE,KEY_DELETE,KEY_DELETE,KEY_DELETE,KEY_DELETE },
    /* 63 */ {0,0,0,0,0,0,0}         // 123-ABC
};

// TODO: add pointer mode table
#define GKOS_KEY_SHIFT   (_|B|_|_|E|_)
#define GKOS_KEY_SYMB    (A|_|C|D|_|F)
#define GKOS_KEY_123_ABC (A|B|C|D|E|F)  /* all keys simultaneously */
#define GKOS_KEY_CTRL    (A|B|C|D|_|F)
#define GKOS_KEY_ALT     (A|B|C|_|E|F)

#endif /* GKOS_PRIVATE_H */
