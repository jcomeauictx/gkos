// test if a break in a `switch` statement, outside of a `case` block,
// breaks out of the switch.
window.onload = function() {
    const check = function(character) {
        result = null;
        switch(character) {
            case "a": result = true; break;
            break;
            default: result = false;
        }
    };
    console.log("check 'a': " + check('a') + " is true");
    console.log("check 'b': " + check('b') + " is false");
};
// vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
